"""
Отладка селекторов для Яндекс карт.
Выводит первые найденные элементы для анализа структуры.
"""
import os
import time
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

def debug_yandex_selectors():
    """Отладка селекторов для Яндекс карт."""

    load_dotenv()
    yandex_urls = os.getenv("YANDEX_URLS")

    if not yandex_urls:
        print("Ошибка: Переменная YANDEX_URLS не найдена в .env")
        return

    # Настройка Selenium WebDriver
    options = webdriver.ChromeOptions()
    # Убираем headless для отладки
    # options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    try:
        driver = webdriver.Chrome(options=options)
        print("✅ Браузер запущен")
    except Exception as e:
        print(f"Ошибка инициализации WebDriver: {e}")
        return

    # Берем только первый URL
    url = yandex_urls.split(',')[0].strip()
    print(f"🔍 Отлаживаем URL: {url}")

    try:
        driver.get(url)
        time.sleep(5)  # Даем время загрузиться

        # Ищем вкладку отзывов и кликаем
        try:
            reviews_tab = driver.find_element(By.CSS_SELECTOR, '[data-testid="reviews-tab"]')
            if reviews_tab:
                driver.execute_script("arguments[0].click();", reviews_tab)
                time.sleep(3)
                print("✅ Кликнули на вкладку отзывов")
        except NoSuchElementException:
            print("ℹ️ Вкладка отзывов не найдена")

        # Немного прокручиваем
        driver.execute_script("window.scrollTo(0, 1000);")
        time.sleep(3)

        # Получаем HTML
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, 'html.parser')

        # Ищем карточки отзывов
        review_selectors = [
            'div[data-testid="business-review-view"]',
            'div[class*="business-review-view"]',
            '.business-review-view',
            'div[class*="review"]'
        ]

        review_cards = []
        used_selector = ""
        for selector in review_selectors:
            review_cards = soup.select(selector)
            if review_cards:
                used_selector = selector
                print(f"✅ Найдены карточки отзывов через селектор: {selector}")
                break

        if not review_cards:
            print("❌ Карточки отзывов не найдены")
            driver.quit()
            return

        print(f"📊 Найдено {len(review_cards)} карточек отзывов")

        # Анализируем первые 3 карточки
        for i, card in enumerate(review_cards[:3], 1):
            print(f"\n--- КАРТОЧКА #{i} ---")

            # Проверяем авторов
            author_selectors = [
                'span[itemprop="name"]',
                '.user-name',
                '[class*="user-name"]',
                '[data-testid="review-author"]'
            ]

            author_found = False
            for selector in author_selectors:
                author_element = card.select_one(selector)
                if author_element:
                    print(f"👤 Автор найден через '{selector}': {author_element.get_text(strip=True)}")
                    author_found = True
                    break

            if not author_found:
                print("⚠️ Автор не найден")

            # Проверяем тексты отзывов
            text_selectors = [
                'span.business-review-view__body-text',
                '[class*="review-text"]',
                '[class*="body-text"]',
                '[data-testid="review-text"]',
                'div[class*="review-body"]',
                'div[itemprop="reviewBody"]',
                '.business-review-view__body'
            ]

            text_found = False
            for selector in text_selectors:
                text_element = card.select_one(selector)
                if text_element:
                    text = text_element.get_text(strip=True)
                    print(f"💬 Текст найден через '{selector}': {text[:100]}...")
                    text_found = True
                    break

            if not text_found:
                print("⚠️ Текст отзыва не найден")
                # Выводим все возможные текстовые элементы
                all_texts = card.find_all(text=True)
                clean_texts = [t.strip() for t in all_texts if t.strip() and len(t.strip()) > 10]
                if clean_texts:
                    print(f"🔍 Найденные тексты в карточке:")
                    for j, txt in enumerate(clean_texts[:3], 1):
                        print(f"  {j}. {txt[:80]}...")

            # Проверяем рейтинги
            rating_found = False
            rating_meta = card.select_one('meta[itemprop="ratingValue"]')
            if rating_meta and rating_meta.has_attr('content'):
                print(f"⭐ Рейтинг найден: {rating_meta['content']}")
                rating_found = True

            if not rating_found:
                full_stars = card.select('.business-rating-badge-view__star._full')
                if full_stars:
                    print(f"⭐ Рейтинг по звёздам: {len(full_stars)}")
                else:
                    print("⚠️ Рейтинг не найден")

        # Сохраняем HTML первой карточки для анализа
        if review_cards:
            with open('debug_card.html', 'w', encoding='utf-8') as f:
                f.write(str(review_cards[0].prettify()))
            print(f"\n💾 HTML первой карточки сохранен в debug_card.html")

    except Exception as e:
        print(f"Ошибка: {e}")
    finally:
        driver.quit()

if __name__ == '__main__':
    debug_yandex_selectors()