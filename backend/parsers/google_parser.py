"""
Парсер отзывов с Google Maps с использованием Selenium.
Реализован по аналогии с парсером Яндекс.Карт.
"""
import os
import time
import re
from datetime import datetime
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from sqlalchemy.orm import sessionmaker

from database import Review, init_db, create_engine_instance
from config.constants import GOOGLE_SELECTORS, PARSING_CONFIG
from utils.date_parser import parse_google_date
from utils.selenium_utils import setup_chrome_driver, extract_background_image_url


class GoogleReviewsParser:
    """Парсер отзывов с Google Maps."""

    def __init__(self):
        """Инициализация парсера."""
        load_dotenv()
        # Для Google URLs не разбиваем по запятым, так как URL содержит координаты
        google_urls_raw = os.getenv("GOOGLE_URLS", "")
        # Если есть несколько URL, они должны быть разделены символом |
        self.google_urls = google_urls_raw.split('|') if '|' in google_urls_raw else [google_urls_raw]
        self.db_name = os.getenv("DATABASE_NAME")

        if not self.google_urls[0] or not self.db_name:
            raise ValueError("Переменные GOOGLE_URLS или DATABASE_NAME не найдены в .env")

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

    def _handle_consent_dialog(self) -> bool:
        """
        Обрабатывает диалог согласия на обработку данных Google.

        Returns:
            bool: True если диалог был обработан
        """
        print("Проверяю наличие диалога согласия...")

        try:
            # Ждем до 10 секунд для диалога согласия
            wait = WebDriverWait(self.driver, 10)

            for selector in GOOGLE_SELECTORS["consent_button"]:
                try:
                    consent_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
                    print(f"✅ Найдена кнопка согласия: {selector}")
                    consent_button.click()
                    print("✅ Кнопка согласия нажата")

                    # Ждем до 10 секунд пока страница перезагрузится
                    time.sleep(10)
                    return True

                except (TimeoutException, NoSuchElementException):
                    continue

            print("ℹ️  Диалог согласия не найден, продолжаем...")
            return False

        except Exception as e:
            print(f"⚠️  Ошибка при обработке диалога согласия: {e}")
            return False

    def _find_and_click_reviews_tab(self) -> bool:
        """
        Находит и кликает на вкладку с отзывами.

        Returns:
            bool: True если вкладка найдена и нажата
        """
        print("Ищу вкладку с отзывами...")

        try:
            wait = WebDriverWait(self.driver, 15)

            # Сначала пробуем найти по aria-label с "Отзывы"
            try:
                tabs = self.driver.find_elements(By.CSS_SELECTOR, 'button[role="tab"]')
                for tab in tabs:
                    try:
                        aria_label = tab.get_attribute('aria-label')
                        if aria_label and 'отзыв' in aria_label.lower():
                            print(f"✅ Найдена вкладка отзывов по aria-label: {aria_label}")
                            tab.click()
                            print("✅ Вкладка отзывов нажата")
                            time.sleep(5)
                            return True
                    except:
                        continue
            except:
                pass

            # Если не нашли, пробуем по текстовому содержимому
            try:
                tabs = self.driver.find_elements(By.CSS_SELECTOR, 'button[role="tab"]')
                for tab in tabs:
                    try:
                        text = tab.text.lower()
                        if 'отзыв' in text or 'review' in text:
                            print(f"✅ Найдена вкладка отзывов по тексту: {tab.text}")
                            tab.click()
                            print("✅ Вкладка отзывов нажата")
                            time.sleep(5)
                            return True
                    except:
                        continue
            except:
                pass

            # В крайнем случае кликаем на вторую вкладку (обычно это отзывы)
            try:
                tabs = self.driver.find_elements(By.CSS_SELECTOR, 'button[role="tab"]')
                if len(tabs) >= 2:
                    print("✅ Пробую кликнуть на вторую вкладку")
                    tabs[1].click()
                    print("✅ Вторая вкладка нажата")
                    time.sleep(5)
                    return True
            except:
                pass

            print("❌ Вкладка с отзывами не найдена")
            return False

        except Exception as e:
            print(f"⚠️  Ошибка при поиске вкладки отзывов: {e}")
            return False

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

            # Обрабатываем диалог согласия
            consent_handled = self._handle_consent_dialog()

            if consent_handled:
                # После клика на согласие нужно подождать, пока страница полностью загрузится
                print("Ожидаю загрузки основной страницы после согласия...")
                time.sleep(15)  # Увеличенное время ожидания

                # Проверяем что мы на правильной странице
                current_url = self.driver.current_url
                print(f"Текущий URL после согласия: {current_url}")

            # Находим и кликаем на вкладку отзывов
            if not self._find_and_click_reviews_tab():
                return False

            # Ждем загрузки отзывов
            wait = WebDriverWait(self.driver, PARSING_CONFIG["page_load_timeout"])

            # Пробуем найти контейнер с отзывами
            reviews_found = False
            print("🔍 Пробую найти отзывы на странице...")

            for i, selector in enumerate(GOOGLE_SELECTORS["review_cards"], 1):
                try:
                    print(f"  Пробую селектор #{i}: {selector}")
                    elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    print(f"    Найдено элементов: {len(elements)}")

                    if elements and len(elements) > 0:
                        # Дополнительная проверка - есть ли в элементах текст отзывов
                        text_found = False
                        for elem in elements[:3]:  # Проверяем первые 3
                            if elem.text and len(elem.text) > 50:
                                text_found = True
                                break

                        if text_found:
                            print("✅ Отзывы найдены!")
                            reviews_found = True
                            break
                        else:
                            print("    Элементы найдены, но без текста отзывов")
                except Exception as e:
                    print(f"    Ошибка с селектором: {e}")
                    continue

            if not reviews_found:
                # Дополнительная отладочная информация
                print("❌ Отзывы не найдены. Показываю структуру страницы:")
                try:
                    # Ищем все элементы с атрибутом data-
                    data_elements = self.driver.find_elements(By.CSS_SELECTOR, "[data-review-id]")
                    print(f"  Элементы с data-review-id: {len(data_elements)}")

                    # Ищем все div с классами
                    all_divs = self.driver.find_elements(By.CSS_SELECTOR, "div[class*='font']")
                    print(f"  Div'ы с 'font' в классе: {len(all_divs)}")

                    # Показываем заголовок страницы для понимания где мы
                    title = self.driver.title
                    print(f"  Заголовок страницы: {title}")

                    # Показываем H1 если есть
                    h1_elements = self.driver.find_elements(By.TAG_NAME, "h1")
                    for h1 in h1_elements:
                        if h1.text.strip():
                            print(f"  H1: {h1.text.strip()}")

                except Exception as e:
                    print(f"  Ошибка при отладке: {e}")

                return False

            time.sleep(5)  # Даем время на загрузку

            # Находим прокручиваемый контейнер
            scrollable_element = self._find_scrollable_container()

            # Прокрутка для загрузки всех отзывов
            self._scroll_to_load_all_reviews(scrollable_element)

            return True

        except TimeoutException:
            print(f"Не удалось загрузить страницу: {url}")
            return False
        except Exception as e:
            print(f"Ошибка при загрузке страницы {url}: {e}")
            return False

    def _find_scrollable_container(self):
        """Находит прокручиваемый контейнер."""
        for selector in GOOGLE_SELECTORS["scrollable_containers"]:
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
            current_reviews = 0
            for selector in GOOGLE_SELECTORS["review_cards"]:
                try:
                    current_reviews = len(self.driver.find_elements(By.CSS_SELECTOR, selector))
                    if current_reviews > 0:
                        break
                except:
                    continue

            print(f"  Найдено отзывов: {current_reviews}")

            # Если количество не изменилось, увеличиваем счетчик стабильности
            if current_reviews == previous_review_count:
                stable_count_attempts += 1
                print(f"  Количество стабильно ({stable_count_attempts}/{max_stable_attempts})")
            else:
                stable_count_attempts = 0  # Сбрасываем, если количество изменилось

            previous_review_count = current_reviews

        print("Загрузка отзывов завершена, начинаю парсинг...")

    def _expand_review_text(self, review_element):
        """
        Раскрывает полный текст отзыва, если есть кнопка 'Ещё'.

        Args:
            review_element: Selenium элемент отзыва
        """
        try:
            for selector in GOOGLE_SELECTORS["expand_button"]:
                try:
                    expand_button = review_element.find_element(By.CSS_SELECTOR, selector)
                    if expand_button.is_displayed():
                        expand_button.click()
                        time.sleep(1)  # Ждем раскрытия текста
                        print("    📖 Текст отзыва раскрыт")
                        return
                except:
                    continue
        except Exception as e:
            print(f"    ⚠️  Не удалось раскрыть текст: {e}")

    def _parse_review_cards(self, url: str) -> int:
        """
        Парсит карточки отзывов со страницы.

        Args:
            url: URL источника

        Returns:
            int: Количество добавленных отзывов
        """
        # Находим все отзывы на странице через Selenium для раскрытия текстов
        review_elements = []
        for selector in GOOGLE_SELECTORS["review_cards"]:
            try:
                review_elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                if review_elements:
                    break
            except:
                continue

        print(f"Найдено {len(review_elements)} отзывов для данного филиала")

        if not review_elements:
            print("Отзывы не найдены, возможно изменилась структура страницы")
            return 0

        # Раскрываем тексты всех отзывов
        for i, element in enumerate(review_elements, 1):
            print(f"  📖 Раскрываю текст отзыва {i}/{len(review_elements)}")
            self._expand_review_text(element)

        # Теперь парсим через BeautifulSoup
        page_source = self.driver.page_source
        soup = BeautifulSoup(page_source, 'html.parser')

        # Ищем карточки отзывов в HTML
        review_cards = []
        for selector in GOOGLE_SELECTORS["review_cards"]:
            review_cards = soup.select(selector)
            if review_cards:
                break

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
                    source='google',
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
        author_name = self._extract_with_selectors(card, GOOGLE_SELECTORS["author"])
        if not author_name:
            print("    ⚠️  Не найден автор отзыва")
            return None

        print(f"    👤 Автор: {author_name}")

        # Текст отзыва
        review_text = self._extract_with_selectors(card, GOOGLE_SELECTORS["text"])
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
            'source': 'google',
            'source_name': 'Google Карты',
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

        for selector in GOOGLE_SELECTORS["date"]:
            date_element = card.select_one(selector)
            if date_element:
                date_str = date_element.get_text(strip=True)
                publish_date = parse_google_date(date_str)
                break

        return publish_date

    def _extract_avatar_url(self, card) -> str:
        """Извлекает URL аватара."""
        for selector in GOOGLE_SELECTORS["avatar"]:
            avatar_element = card.select_one(selector)
            if avatar_element and avatar_element.has_attr('src'):
                return avatar_element['src']
        return None

    def _extract_rating(self, card) -> float:
        """Извлекает рейтинг отзыва."""
        try:
            for selector in GOOGLE_SELECTORS["rating"]:
                rating_element = card.select_one(selector)
                if rating_element and rating_element.has_attr('aria-label'):
                    aria_label = rating_element['aria-label']
                    # Ищем число в aria-label (например, "5 звезд")
                    rating_match = re.search(r'(\d+)', aria_label)
                    if rating_match:
                        return float(rating_match.group(1))

        except (ValueError, TypeError):
            pass

        return PARSING_CONFIG["default_rating"]

    def fetch_all_reviews(self) -> int:
        """
        Основная функция для сбора всех отзывов.

        Returns:
            int: Общее количество новых отзывов
        """
        print("Начинаю сбор отзывов с Google Maps...")
        total_new_reviews = 0

        for url in self.google_urls:
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
        print(f"Сбор отзывов с Google Maps завершен. Всего добавлено новых отзывов: {total_new_reviews}")
        return total_new_reviews


def fetch_and_save_google_reviews() -> int:
    """
    Функция-обертка для совместимости со старым API.

    Returns:
        int: Количество новых отзывов
    """
    with GoogleReviewsParser() as parser:
        return parser.fetch_all_reviews()