"""
Базовый класс для парсеров отзывов.
Содержит общую логику, используемую в Google и Yandex парсерах.
"""
import os
import time
from abc import ABC, abstractmethod
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from sqlalchemy.orm import Session
from database import Review, get_session
from utils.selenium_utils import setup_chrome_driver
from config.constants import PARSING_CONFIG


class BaseReviewsParser(ABC):
    """
    Базовый класс для всех парсеров отзывов.
    Содержит общую логику скроллинга, базы данных и инициализации.
    """

    def __init__(self):
        """Инициализация парсера."""
        self.driver = None
        self.session: Session = None
        self.source_urls = self._get_source_urls()

    @abstractmethod
    def _get_source_urls(self) -> list:
        """Получить список URL для парсинга. Должен быть переопределен в наследниках."""
        pass

    @abstractmethod
    def _get_review_cards_selectors(self) -> list:
        """Получить селекторы для карточек отзывов. Должен быть переопределен в наследниках."""
        pass

    def __enter__(self):
        """Контекстный менеджер - вход."""
        try:
            self.driver = setup_chrome_driver(headless=True)
            self.session = get_session()
            return self
        except Exception as e:
            if self.driver:
                self.driver.quit()
            if self.session:
                self.session.close()
            raise e

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Контекстный менеджер - выход."""
        if self.driver:
            self.driver.quit()
        if self.session:
            self.session.close()

    def _find_scrollable_container(self):
        """
        Находит контейнер для скроллинга отзывов.
        Возвращает либо найденный элемент, либо body документа.
        """
        scrollable_selectors = getattr(self, '_get_scrollable_selectors', lambda: [])()

        for selector in scrollable_selectors:
            try:
                scrollable_element = self.driver.find_element(By.CSS_SELECTOR, selector)
                if scrollable_element:
                    return scrollable_element
            except NoSuchElementException:
                continue

        # Если не нашли специальный контейнер, используем body
        try:
            return self.driver.find_element(By.TAG_NAME, "body")
        except NoSuchElementException:
            return None

    def _scroll_to_load_all_reviews(self, scrollable_element):
        """
        Прокручивает страницу до загрузки всех отзывов.
        Использует настройки из constants.py.
        """
        if not scrollable_element:
            return

        max_stable_attempts = PARSING_CONFIG["max_stable_attempts"]
        scroll_delay = PARSING_CONFIG["scroll_delay"]

        previous_review_count = 0
        stable_count_attempts = 0

        while stable_count_attempts < max_stable_attempts:
            # Прокручиваем вниз
            self.driver.execute_script("arguments[0].scrollTo(0, arguments[0].scrollHeight);", scrollable_element)
            time.sleep(scroll_delay)

            # Подсчитываем текущее количество отзывов
            current_reviews = self._count_current_reviews()

            if current_reviews == previous_review_count:
                stable_count_attempts += 1
            else:
                stable_count_attempts = 0
                previous_review_count = current_reviews

    def _count_current_reviews(self) -> int:
        """
        Подсчитывает текущее количество отзывов на странице.
        Использует селекторы из наследников.
        """
        for selector in self._get_review_cards_selectors():
            try:
                reviews = self.driver.find_elements(By.CSS_SELECTOR, selector)
                if reviews:
                    return len(reviews)
            except:
                continue
        return 0

    def _check_duplicate_review(self, review_data: dict) -> bool:
        """
        Проверяет, существует ли отзыв в базе данных.

        Args:
            review_data: Данные отзыва

        Returns:
            bool: True если отзыв уже существует
        """
        existing_review = self.session.query(Review).filter_by(
            source=review_data['source'],
            author_name=review_data['author_name'],
            review_text=review_data['review_text']
        ).first()

        return existing_review is not None

    def _save_review(self, review_data: dict) -> bool:
        """
        Сохраняет отзыв в базу данных, если он не является дубликатом.

        Args:
            review_data: Данные отзыва

        Returns:
            bool: True если отзыв был сохранен
        """
        if not self._check_duplicate_review(review_data):
            new_review = Review(**review_data)
            self.session.add(new_review)
            return True
        return False

    @abstractmethod
    def _load_all_reviews(self, url: str) -> bool:
        """Загружает все отзывы для конкретного URL. Должен быть переопределен в наследниках."""
        pass

    @abstractmethod
    def _parse_review_cards(self, url: str) -> int:
        """Парсит карточки отзывов. Должен быть переопределен в наследниках."""
        pass

    def fetch_all_reviews(self) -> int:
        """
        Основная функция для сбора всех отзывов.

        Returns:
            int: Общее количество новых отзывов
        """
        total_new_reviews = 0

        for url in self.source_urls:
            url = url.strip()
            if not url:
                continue

            try:
                if self._load_all_reviews(url):
                    new_reviews_count = self._parse_review_cards(url)
                    total_new_reviews += new_reviews_count

            except Exception as e:
                print(f"Ошибка при обработке URL {url}: {e}")
                continue

        # Сохранение изменений
        self.session.commit()
        return total_new_reviews