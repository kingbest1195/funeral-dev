"""
Тестовая версия парсера Яндекс карт без записи в БД.
Только для проверки работы и получения списка отзывов.
"""
import os
import time
from datetime import datetime, timedelta
import re
import json

from bs4 import BeautifulSoup
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager

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

def test_yandex_parser():
    """
    Тестовая функция для парсинга отзывов с Яндекс Карт без записи в БД.
    Возвращает список отзывов.
    """
    # Загружаем переменные окружения
    load_dotenv()
    yandex_urls = os.getenv("YANDEX_URLS")

    if not yandex_urls:
        print("Ошибка: Переменная YANDEX_URLS не найдена в .env")
        return []

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
        # Пробуем разные способы инициализации ChromeDriver
        chrome_driver_path = None

        try:
            # Способ 1: Через webdriver-manager
            chrome_driver_path = ChromeDriverManager().install()
        except Exception as e1:
            print(f"Webdriver-manager не сработал: {e1}")

            try:
                # Способ 2: Системный chromedriver
                driver = webdriver.Chrome(options=options)
                driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
                print("✅ Используем системный ChromeDriver")
            except Exception as e2:
                print(f"Системный ChromeDriver не найден: {e2}")
                print("❌ Не удалось запустить браузер. Используйте mock-версию: python3 test_parser_mock.py")
                return []
        else:
            driver = webdriver.Chrome(
                service=ChromeService(chrome_driver_path),
                options=options
            )
            driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            print(f"✅ Используем ChromeDriver: {chrome_driver_path}")

    except Exception as e:
        print(f"Ошибка инициализации WebDriver: {e}")
        print("💡 Попробуйте запустить mock-версию: python3 test_parser_mock.py")
        return []

    print("Начинаю тестовый сбор отзывов с Яндекс Карт...")

    all_reviews = []

    # Основной цикл парсинга
    for i, url in enumerate(yandex_urls.split(','), 1):
        url = url.strip()
        if not url:
            continue

        print(f"\n--- Филиал {i} ---")
        print(f"Обрабатываю URL: {url}")

        try:
            driver.get(url)

            # Ждем загрузки страницы
            wait = WebDriverWait(driver, 15)

            try:
                # Ждем появления списка отзывов или кнопки отзывов
                wait.until(EC.any_of(
                    EC.presence_of_element_located((By.CSS_SELECTOR, 'div[data-testid="business-review-view"]')),
                    EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="reviews-tab"]')),
                    EC.element_to_be_clickable((By.CSS_SELECTOR, '[aria-label*="отзыв"]'))
                ))
            except TimeoutException:
                print(f"❌ Не удалось найти отзывы на странице: {url}")
                continue

            # Попробуем найти и кликнуть на вкладку отзывов
            try:
                reviews_tab = driver.find_element(By.CSS_SELECTOR, '[data-testid="reviews-tab"]')
                if reviews_tab:
                    driver.execute_script("arguments[0].click();", reviews_tab)
                    time.sleep(3)
                    print("✅ Кликнули на вкладку отзывов")
            except NoSuchElementException:
                print("ℹ️ Вкладка отзывов не найдена, возможно уже открыта")

            time.sleep(5)  # Даем время на загрузку

            # Прокрутка для загрузки всех отзывов
            print("🔄 Загружаю все отзывы...")

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
                    print(f"✅ Найден контейнер: {selector}")
                    break
                except NoSuchElementException:
                    continue

            # Если не нашли специальный контейнер, прокручиваем всю страницу
            if not scrollable_element:
                scrollable_element = driver.find_element(By.TAG_NAME, "body")
                print("ℹ️ Используем прокрутку всей страницы")

            # Прокрутка с загрузкой новых отзывов
            last_height = driver.execute_script("return arguments[0].scrollHeight", scrollable_element)
            scroll_attempts = 0
            max_scroll_attempts = 15

            while scroll_attempts < max_scroll_attempts:
                # Прокручиваем
                driver.execute_script("arguments[0].scrollTo(0, arguments[0].scrollHeight);", scrollable_element)
                time.sleep(2)

                # Проверяем, изменилась ли высота
                new_height = driver.execute_script("return arguments[0].scrollHeight", scrollable_element)
                if new_height == last_height:
                    scroll_attempts += 1
                else:
                    scroll_attempts = 0  # Сбрасываем счетчик, так как контент загрузился

                last_height = new_height

            print("✅ Загрузка отзывов завершена, начинаю парсинг...")

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
                    print(f"✅ Найдены отзывы через селектор: {selector}")
                    break

            print(f"📊 Найдено {len(review_cards)} отзывов для филиала {i}")

            if not review_cards:
                print("❌ Отзывы не найдены, возможно изменилась структура страницы")
                continue

            branch_reviews = []

            for j, card in enumerate(review_cards, 1):
                try:
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
                        continue

                    # Текст отзыва
                    text_selectors = [
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
                        continue

                    # Дата отзыва
                    date_selectors = [
                        'span.business-review-view__date',
                        '[class*="review-date"]',
                        '[class*="date"]',
                        '[data-testid="review-date"]'
                    ]

                    publish_date = datetime.now()  # По умолчанию
                    date_str = "не найдена"
                    for selector in date_selectors:
                        date_element = card.select_one(selector)
                        if date_element:
                            date_str = date_element.get_text(strip=True)
                            publish_date = parse_yandex_date(date_str)
                            break

                    # Аватар (может отсутствовать)
                    avatar_selectors = [
                        'img.user-avatar-view__image',
                        '[class*="avatar"] img',
                        '[class*="user-image"] img'
                    ]

                    author_avatar_url = None
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

                    review_data = {
                        'branch': i,
                        'review_number': j,
                        'source': 'yandex',
                        'source_name': 'Яндекс.Бизнес',
                        'source_url': url,
                        'author_name': author_name,
                        'review_text': review_text,
                        'rating': rating,
                        'date_original': date_str,
                        'publish_date': publish_date.strftime('%Y-%m-%d %H:%M:%S'),
                        'author_avatar_url': author_avatar_url,
                        'text_length': len(review_text)
                    }

                    branch_reviews.append(review_data)
                    all_reviews.append(review_data)

                    print(f"  ✅ Отзыв {j}: {author_name} - {len(review_text)} символов")

                except Exception as e:
                    print(f"  ❌ Ошибка обработки отзыва {j}: {e}")
                    continue

            print(f"📈 Собрано {len(branch_reviews)} отзывов с филиала {i}")

        except Exception as e:
            print(f"❌ Ошибка при обработке филиала {i} ({url}): {e}")
            continue

    # Закрываем браузер
    driver.quit()

    print(f"\n🎉 Тестовый сбор завершен! Всего собрано: {len(all_reviews)} отзывов")

    return all_reviews

if __name__ == '__main__':
    reviews = test_yandex_parser()

    if reviews:
        print("\n" + "="*80)
        print("📋 РЕЗУЛЬТАТЫ ПАРСИНГА:")
        print("="*80)

        # Сортируем по длине текста (убывание) → дате (убывание)
        reviews_sorted = sorted(reviews, key=lambda x: (-x['text_length'], x['publish_date']), reverse=False)

        for i, review in enumerate(reviews_sorted[:10], 1):  # Показываем топ-10
            print(f"\n--- Отзыв #{i} (филиал {review['branch']}) ---")
            print(f"Автор: {review['author_name']}")
            print(f"Дата: {review['date_original']} ({review['publish_date']})")
            print(f"Текст ({review['text_length']} символов): {review['review_text'][:200]}{'...' if len(review['review_text']) > 200 else ''}")
            if review['author_avatar_url']:
                print(f"Аватар: {review['author_avatar_url']}")
            print("-" * 50)

        # Сохраняем в JSON для дальнейшего анализа
        with open('test_reviews.json', 'w', encoding='utf-8') as f:
            json.dump(reviews, f, ensure_ascii=False, indent=2, default=str)

        print(f"\n💾 Все отзывы сохранены в файл: test_reviews.json")

        # Статистика
        total_chars = sum(r['text_length'] for r in reviews)
        avg_length = total_chars / len(reviews) if reviews else 0

        print(f"\n📊 СТАТИСТИКА:")
        print(f"Всего отзывов: {len(reviews)}")
        print(f"Средняя длина отзыва: {avg_length:.1f} символов")
        print(f"Самый длинный отзыв: {max(r['text_length'] for r in reviews)} символов")
        print(f"Самый короткий отзыв: {min(r['text_length'] for r in reviews)} символов")
    else:
        print("\n❌ Отзывы не найдены или произошла ошибка")