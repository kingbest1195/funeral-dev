"""
Парсер отзывов с Яндекс Карт с использованием Selenium.
Основан на документации из docs/features-modules/fetching-reviews-google-yandex/yandex-parser-py.md
"""
import os
import time
from datetime import datetime, timedelta
import re

from bs4 import BeautifulSoup
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from sqlalchemy.orm import sessionmaker
from webdriver_manager.chrome import ChromeDriverManager

from database import Review, init_db, create_engine_instance

def parse_yandex_date(date_str):
    """
    Парсит дату из Яндекс карт.
    Поддерживает форматы: "вчера", "2 дня назад", "неделю назад", "месяц назад", "ДД месяца ГГГГ"
    """
    date_str = date_str.lower().strip()
    now = datetime.now()

    # Относительные даты
    if "вчера" in date_str:
        return now - timedelta(days=1)
    elif "дня назад" in date_str or "день назад" in date_str:
        days_match = re.search(r'(\d+)', date_str)
        if days_match:
            days = int(days_match.group(1))
            return now - timedelta(days=days)
        return now - timedelta(days=1)
    elif "недел" in date_str:
        weeks_match = re.search(r'(\d+)', date_str)
        if weeks_match:
            weeks = int(weeks_match.group(1))
            return now - timedelta(weeks=weeks)
        return now - timedelta(weeks=1)
    elif "месяц" in date_str:
        months_match = re.search(r'(\d+)', date_str)
        if months_match:
            months = int(months_match.group(1))
            return now - timedelta(days=months * 30)
        return now - timedelta(days=30)
    elif "год" in date_str:
        years_match = re.search(r'(\d+)', date_str)
        if years_match:
            years = int(years_match.group(1))
            return now - timedelta(days=years * 365)
        return now - timedelta(days=365)

    # Попытка парсить абсолютную дату
    # Формат: "15 декабря 2023"
    months_map = {
        'января': 1, 'февраля': 2, 'марта': 3, 'апреля': 4, 'мая': 5, 'июня': 6,
        'июля': 7, 'августа': 8, 'сентября': 9, 'октября': 10, 'ноября': 11, 'декабря': 12
    }

    for month_name, month_num in months_map.items():
        if month_name in date_str:
            try:
                parts = date_str.split()
                day = int(parts[0])
                year = int(parts[2]) if len(parts) > 2 else now.year
                return datetime(year, month_num, day)
            except (ValueError, IndexError):
                continue

    # Если не удалось распарсить, возвращаем текущую дату
    return now

def fetch_and_save_yandex_reviews():
    """
    Основная функция для парсинга отзывов с Яндекс Карт и сохранения их в базу данных.
    """
    # Загружаем переменные окружения
    load_dotenv()
    yandex_urls = os.getenv("YANDEX_URLS")
    db_name = os.getenv("DATABASE_NAME")

    if not yandex_urls or not db_name:
        print("Ошибка: Переменные YANDEX_URLS или DATABASE_NAME не найдены в .env")
        return

    # Подключение к базе данных
    engine = create_engine_instance()
    Session = sessionmaker(bind=engine)
    session = Session()

    # Инициализируем БД, если таблицы не существует
    init_db()

    # Настройка Selenium WebDriver
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  # Запуск в фоновом режиме
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

    try:
        # Пробуем использовать системный ChromeDriver
        try:
            driver = webdriver.Chrome(options=options)
            driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            print("✅ Используем системный ChromeDriver")
        except Exception as e1:
            print(f"Системный ChromeDriver не найден: {e1}")
            try:
                # Если системный не работает, пробуем webdriver-manager
                driver = webdriver.Chrome(
                    service=ChromeService(ChromeDriverManager().install()),
                    options=options
                )
                driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
                print("✅ Используем ChromeDriver через webdriver-manager")
            except Exception as e2:
                print(f"Webdriver-manager тоже не работает: {e2}")
                print("❌ Не удалось инициализировать браузер")
                return
    except Exception as e:
        print(f"Общая ошибка инициализации WebDriver: {e}")
        return

    print("Начинаю сбор отзывов с Яндекс Карт...")

    total_new_reviews = 0

    # Основной цикл парсинга
    for url in yandex_urls.split(','):
        url = url.strip()
        if not url:
            continue

        try:
            print(f"Обрабатываю URL: {url}")
            driver.get(url)

            # Ждем загрузки страницы
            wait = WebDriverWait(driver, 15)

            try:
                # Ждем появления отзывов (URL уже ведет на страницу отзывов)
                wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'div[class*="business-review-view"]')))
                print(f"✅ Страница отзывов загружена")
            except TimeoutException:
                print(f"Не удалось найти отзывы на странице: {url}")
                continue

            time.sleep(5)  # Даем время на загрузку

            # Прокрутка для загрузки всех отзывов
            print("Загружаю все отзывы...")

            # Найдем контейнер со списком отзывов
            scrollable_selectors = [
                'div[class*="business-reviews-card-view__reviews-list"]',
                'div[class*="scroll-container"]',
                'div[data-testid="reviews-list"]',
                '.business-reviews-card-view'
            ]

            scrollable_element = None
            for selector in scrollable_selectors:
                try:
                    scrollable_element = driver.find_element(By.CSS_SELECTOR, selector)
                    break
                except NoSuchElementException:
                    continue

            # Если не нашли специальный контейнер, прокручиваем всю страницу
            if not scrollable_element:
                scrollable_element = driver.find_element(By.TAG_NAME, "body")

            # Прокрутка с загрузкой новых отзывов
            print("Начинаю прокрутку для загрузки всех отзывов...")

            previous_review_count = 0
            stable_count_attempts = 0
            max_stable_attempts = 5

            while stable_count_attempts < max_stable_attempts:
                # Прокручиваем страницу
                driver.execute_script("arguments[0].scrollTo(0, arguments[0].scrollHeight);", scrollable_element)
                time.sleep(2)

                # Подсчитываем текущее количество отзывов
                current_reviews = len(driver.find_elements(By.CSS_SELECTOR, 'div[class*="business-review-view"]'))
                print(f"  Найдено отзывов: {current_reviews}")

                # Если количество не изменилось, увеличиваем счетчик стабильности
                if current_reviews == previous_review_count:
                    stable_count_attempts += 1
                    print(f"  Количество стабильно ({stable_count_attempts}/{max_stable_attempts})")
                else:
                    stable_count_attempts = 0  # Сбрасываем, если количество изменилось

                previous_review_count = current_reviews

            print("Загрузка отзывов завершена, начинаю парсинг...")

            # Получаем HTML после полной загрузки
            page_source = driver.page_source
            soup = BeautifulSoup(page_source, 'html.parser')

            # Ищем карточки отзывов по различным селекторам
            review_selectors = [
                'div[data-testid="business-review-view"]',
                'div[class*="business-review-view"]',
                '.business-review-view',
                'div[class*="review"]'
            ]

            review_cards = []
            for selector in review_selectors:
                review_cards = soup.select(selector)
                if review_cards:
                    break

            print(f"Найдено {len(review_cards)} отзывов для данного филиала")

            if not review_cards:
                print("Отзывы не найдены, возможно изменилась структура страницы")
                continue

            new_reviews_count = 0
            processed_reviews = set()  # Для избежания дубликатов в одной сессии

            for j, card in enumerate(review_cards, 1):
                try:
                    print(f"  📝 Обрабатываю отзыв {j}/{len(review_cards)}")

                    # Извлекаем данные отзыва
                    author_selectors = [
                        'span[itemprop="name"]',
                        '.user-name',
                        '[class*="user-name"]',
                        '[data-testid="review-author"]'
                    ]

                    author_name = None
                    for selector in author_selectors:
                        author_element = card.select_one(selector)
                        if author_element:
                            author_name = author_element.get_text(strip=True)
                            break

                    if not author_name:
                        print(f"    ⚠️  Не найден автор отзыва")
                        continue

                    print(f"    👤 Автор: {author_name}")

                    # Текст отзыва
                    text_selectors = [
                        'div[itemprop="reviewBody"]',
                        'span.business-review-view__body-text',
                        '[class*="review-text"]',
                        '[class*="body-text"]',
                        '[data-testid="review-text"]'
                    ]

                    review_text = None
                    for selector in text_selectors:
                        text_element = card.select_one(selector)
                        if text_element:
                            review_text = text_element.get_text(strip=True)
                            break

                    if not review_text:
                        print(f"    ⚠️  Не найден текст отзыва")
                        continue

                    print(f"    💬 Текст: {review_text[:50]}...")

                    # Проверяем дубликаты в текущей сессии
                    review_hash = f"{author_name}|{review_text[:100]}"
                    if review_hash in processed_reviews:
                        print(f"    ⚪ Дубликат отзыва пропущен")
                        continue
                    processed_reviews.add(review_hash)

                    # Дата отзыва
                    date_selectors = [
                        'span.business-review-view__date',
                        '[class*="review-date"]',
                        '[class*="date"]',
                        '[data-testid="review-date"]'
                    ]

                    publish_date = datetime.now()  # По умолчанию
                    for selector in date_selectors:
                        date_element = card.select_one(selector)
                        if date_element:
                            date_str = date_element.get_text(strip=True)
                            publish_date = parse_yandex_date(date_str)
                            break

                    # Аватар (может отсутствовать) - извлекаем из background-image в style
                    author_avatar_url = None

                    # Ищем элемент с классом user-icon-view__icon
                    avatar_element = card.select_one('.user-icon-view__icon')
                    if avatar_element and avatar_element.has_attr('style'):
                        style_attr = avatar_element['style']
                        # Извлекаем URL из background-image:url("...")
                        url_match = re.search(r'background-image\s*:\s*url\s*\(\s*["\']?(.*?)["\']?\s*\)', style_attr)
                        if url_match:
                            author_avatar_url = url_match.group(1)

                    # Дополнительные селекторы на случай других структур
                    if not author_avatar_url:
                        avatar_selectors = [
                            'img.user-avatar-view__image',
                            '[class*="avatar"] img',
                            '[class*="user-image"] img'
                        ]
                        for selector in avatar_selectors:
                            avatar_img = card.select_one(selector)
                            if avatar_img and avatar_img.has_attr('src'):
                                author_avatar_url = avatar_img['src']
                                break

                    # Рейтинг отзыва
                    rating = 5.0  # По умолчанию
                    try:
                        # Ищем meta тег с рейтингом
                        rating_meta = card.select_one('meta[itemprop="ratingValue"]')
                        if rating_meta and rating_meta.has_attr('content'):
                            rating_value = rating_meta['content']
                            rating = float(rating_value)
                        else:
                            # Альтернативный способ - подсчет звезд
                            full_stars = card.select('.business-rating-badge-view__star._full')
                            if full_stars:
                                rating = float(len(full_stars))
                    except (ValueError, TypeError):
                        rating = 5.0  # Если не удалось распарсить, оставляем 5

                    # Проверяем, существует ли уже такой отзыв
                    existing_review = session.query(Review).filter_by(
                        source='yandex',
                        author_name=author_name,
                        review_text=review_text
                    ).first()

                    if not existing_review:
                        new_review = Review(
                            source='yandex',
                            source_name='Яндекс.Бизнес',
                            source_url=url,
                            author_name=author_name,
                            author_avatar_url=author_avatar_url,
                            review_text=review_text,
                            publish_date=publish_date,
                            rating=rating
                        )
                        session.add(new_review)
                        new_reviews_count += 1
                        print(f"    ✅ Добавлен новый отзыв от: {author_name} (⭐{rating})")
                    else:
                        print(f"    ⚪ Отзыв от {author_name} уже существует")

                except Exception as e:
                    print(f"  ! Не удалось обработать карточку отзыва: {e}")
                    continue

            print(f"Добавлено {new_reviews_count} новых отзывов для URL: {url}")
            total_new_reviews += new_reviews_count

        except Exception as e:
            print(f"Ошибка при обработке URL {url}: {e}")
            continue

    # Сохранение изменений
    session.commit()
    session.close()
    driver.quit()

    print(f"Сбор отзывов с Яндекс Карт завершен. Всего добавлено новых отзывов: {total_new_reviews}")

if __name__ == '__main__':
    # Этот блок позволяет запустить файл напрямую для тестирования
    fetch_and_save_yandex_reviews()