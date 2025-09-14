"""
Парсер отзывов с Яндекс Карт с использованием Selenium.
Оптимизированная версия с модульной архитектурой.
"""
import os
import time
from datetime import datetime
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from sqlalchemy.orm import sessionmaker

from database import Review, init_db, create_engine_instance
from config.constants import YANDEX_SELECTORS, PARSING_CONFIG
from utils.date_parser import parse_yandex_date
from utils.selenium_utils import setup_chrome_driver, extract_background_image_url


class YandexReviewsParser:
    """Парсер отзывов с Яндекс Карт."""

    def __init__(self):
        """Инициализация парсера."""
        load_dotenv()
        self.yandex_urls = os.getenv("YANDEX_URLS", "").split(',')
        self.db_name = os.getenv("DATABASE_NAME")

        if not self.yandex_urls[0] or not self.db_name:
            raise ValueError("Переменные YANDEX_URLS или DATABASE_NAME не найдены в .env")

        # Подключение к базе данных
        self.engine = create_engine_instance()
        Session = sessionmaker(bind=self.engine)
        self.session = Session()

        # Инициализируем БД, если таблицы не существуют
        init_db()

        self.driver = None

    def __enter__(self):
        """Контекстный менеджер - инициализация."""
        self.driver = setup_chrome_driver(headless=True)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Контекстный менеджер - очистка."""
        if self.driver:
            self.driver.quit()
        if self.session:
            self.session.close()

    def _load_all_reviews(self, url: str) -> bool:
        """
        Загружает страницу и скроллит для получения всех отзывов.

        Args:
            url: URL страницы с отзывами

        Returns:
            bool: True если загрузка успешна
        """
        try:
            print(f"Обрабатываю URL: {url}")
            self.driver.get(url)

            # Ждем загрузки отзывов
            wait = WebDriverWait(self.driver, PARSING_CONFIG["page_load_timeout"])
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'div[class*="business-review-view"]')))
            print("✅ Страница отзывов загружена")

            time.sleep(5)  # Даем время на загрузку

            # Находим прокручиваемый контейнер
            scrollable_element = self._find_scrollable_container()

            # Прокрутка для загрузки всех отзывов
            self._scroll_to_load_all_reviews(scrollable_element)

            return True

        except TimeoutException:
            print(f"Не удалось найти отзывы на странице: {url}")
            return False

    def _find_scrollable_container(self):
        """Находит прокручиваемый контейнер."""
        for selector in YANDEX_SELECTORS["scrollable_containers"]:
            try:
                return self.driver.find_element(By.CSS_SELECTOR, selector)
            except:
                continue

        # Если не нашли специальный контейнер, прокручиваем всю страницу
        return self.driver.find_element(By.TAG_NAME, "body")

    def _scroll_to_load_all_reviews(self, scrollable_element):
        """Прокручивает страницу для загрузки всех отзывов."""
        print("Начинаю прокрутку для загрузки всех отзывов...")

        previous_review_count = 0
        stable_count_attempts = 0
        max_stable_attempts = PARSING_CONFIG["max_stable_attempts"]
        scroll_delay = PARSING_CONFIG["scroll_delay"]

        while stable_count_attempts < max_stable_attempts:
            # Прокручиваем страницу
            self.driver.execute_script("arguments[0].scrollTo(0, arguments[0].scrollHeight);", scrollable_element)
            time.sleep(scroll_delay)

            # Подсчитываем текущее количество отзывов
            current_reviews = len(self.driver.find_elements(By.CSS_SELECTOR, 'div[class*="business-review-view"]'))
            print(f"  Найдено отзывов: {current_reviews}")

            # Если количество не изменилось, увеличиваем счетчик стабильности
            if current_reviews == previous_review_count:
                stable_count_attempts += 1
                print(f"  Количество стабильно ({stable_count_attempts}/{max_stable_attempts})")
            else:
                stable_count_attempts = 0  # Сбрасываем, если количество изменилось

            previous_review_count = current_reviews

        print("Загрузка отзывов завершена, начинаю парсинг...")

    def _parse_review_cards(self, url: str) -> int:
        """
        Парсит карточки отзывов со страницы.

        Args:
            url: URL источника

        Returns:
            int: Количество добавленных отзывов
        """
        page_source = self.driver.page_source
        soup = BeautifulSoup(page_source, 'html.parser')

        # Ищем карточки отзывов
        review_cards = []
        for selector in YANDEX_SELECTORS["review_cards"]:
            review_cards = soup.select(selector)
            if review_cards:
                break

        print(f"Найдено {len(review_cards)} отзывов для данного филиала")

        if not review_cards:
            print("Отзывы не найдены, возможно изменилась структура страницы")
            return 0

        new_reviews_count = 0
        processed_reviews = set()  # Для избежания дубликатов

        for j, card in enumerate(review_cards, 1):
            try:
                print(f"  📝 Обрабатываю отзыв {j}/{len(review_cards)}")
                review_data = self._extract_review_data(card, url)

                if not review_data:
                    continue

                # Проверяем дубликаты в текущей сессии
                review_hash = f"{review_data['author_name']}|{review_data['review_text'][:100]}"
                if review_hash in processed_reviews:
                    print(f"    ⚪ Дубликат отзыва пропущен")
                    continue
                processed_reviews.add(review_hash)

                # Проверяем, существует ли уже такой отзыв в БД
                existing_review = self.session.query(Review).filter_by(
                    source='yandex',
                    author_name=review_data['author_name'],
                    review_text=review_data['review_text']
                ).first()

                if not existing_review:
                    new_review = Review(**review_data)
                    self.session.add(new_review)
                    new_reviews_count += 1
                    print(f"    ✅ Добавлен новый отзыв от: {review_data['author_name']} (⭐{review_data['rating']})")
                else:
                    print(f"    ⚪ Отзыв от {review_data['author_name']} уже существует")

            except Exception as e:
                print(f"  ! Не удалось обработать карточку отзыва: {e}")
                continue

        return new_reviews_count

    def _extract_review_data(self, card, url: str) -> dict:
        """
        Извлекает данные отзыва из карточки.

        Args:
            card: BeautifulSoup элемент карточки
            url: URL источника

        Returns:
            dict: Данные отзыва или None
        """
        # Автор
        author_name = self._extract_with_selectors(card, YANDEX_SELECTORS["author"])
        if not author_name:
            print("    ⚠️  Не найден автор отзыва")
            return None

        print(f"    👤 Автор: {author_name}")

        # Текст отзыва
        review_text = self._extract_with_selectors(card, YANDEX_SELECTORS["text"])
        if not review_text:
            print("    ⚠️  Не найден текст отзыва")
            return None

        print(f"    💬 Текст: {review_text[:50]}...")

        # Дата отзыва
        publish_date = self._extract_review_date(card)

        # Аватар пользователя
        author_avatar_url = self._extract_avatar_url(card)

        # Рейтинг отзыва
        rating = self._extract_rating(card)

        return {
            'source': 'yandex',
            'source_name': 'Яндекс.Бизнес',
            'source_url': url,
            'author_name': author_name,
            'author_avatar_url': author_avatar_url,
            'review_text': review_text,
            'publish_date': publish_date,
            'rating': rating
        }

    def _extract_with_selectors(self, card, selectors: list) -> str:
        """Извлекает текст, пробуя различные селекторы."""
        for selector in selectors:
            element = card.select_one(selector)
            if element:
                return element.get_text(strip=True)
        return None

    def _extract_review_date(self, card) -> datetime:
        """Извлекает и парсит дату отзыва."""
        publish_date = datetime.now()  # По умолчанию

        for selector in YANDEX_SELECTORS["date"]:
            date_element = card.select_one(selector)
            if date_element:
                date_str = date_element.get_text(strip=True)
                publish_date = parse_yandex_date(date_str)
                break

        return publish_date

    def _extract_avatar_url(self, card) -> str:
        """Извлекает URL аватара из background-image."""
        avatar_element = card.select_one(YANDEX_SELECTORS["avatar"])
        if avatar_element and avatar_element.has_attr('style'):
            return extract_background_image_url(avatar_element['style'])
        return None

    def _extract_rating(self, card) -> float:
        """Извлекает рейтинг отзыва."""
        try:
            # Ищем meta тег с рейтингом
            rating_meta = card.select_one('meta[itemprop="ratingValue"]')
            if rating_meta and rating_meta.has_attr('content'):
                return float(rating_meta['content'])

            # Альтернативный способ - подсчет звезд
            full_stars = card.select('.business-rating-badge-view__star._full')
            if full_stars:
                return float(len(full_stars))

        except (ValueError, TypeError):
            pass

        return PARSING_CONFIG["default_rating"]

    def fetch_all_reviews(self) -> int:
        """
        Основная функция для сбора всех отзывов.

        Returns:
            int: Общее количество новых отзывов
        """
        print("Начинаю сбор отзывов с Яндекс Карт...")
        total_new_reviews = 0

        for url in self.yandex_urls:
            url = url.strip()
            if not url:
                continue

            try:
                if self._load_all_reviews(url):
                    new_reviews_count = self._parse_review_cards(url)
                    print(f"Добавлено {new_reviews_count} новых отзывов для URL: {url}")
                    total_new_reviews += new_reviews_count

            except Exception as e:
                print(f"Ошибка при обработке URL {url}: {e}")
                continue

        # Сохранение изменений
        self.session.commit()
        print(f"Сбор отзывов с Яндекс Карт завершен. Всего добавлено новых отзывов: {total_new_reviews}")
        return total_new_reviews


def fetch_and_save_yandex_reviews() -> int:
    """
    Функция-обертка для совместимости со старым API.

    Returns:
        int: Количество новых отзывов
    """
    with YandexReviewsParser() as parser:
        return parser.fetch_all_reviews()