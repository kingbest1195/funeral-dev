#!/usr/bin/env python3
"""
Скрипт для детального анализа HTML структуры отзывов Google Maps.
"""
import sys
import os
import time

# Добавляем текущую директорию в путь для импорта модулей
sys.path.insert(0, os.path.dirname(__file__))

from utils.selenium_utils import setup_chrome_driver
from selenium.webdriver.common.by import By

def debug_reviews_structure():
    """Анализируем структуру страницы с отзывами."""
    print("🔬 Детальный анализ структуры отзывов Google Maps...")
    print("=" * 60)

    url = "https://www.google.com/maps/place/%D0%92%D0%B5%D0%BA+%D0%A0%D0%B8%D1%82%D1%83%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F+%D0%A1%D0%BB%D1%83%D0%B6%D0%B1%D0%B0/@56.8466536,41.3764817,15z/data=!4m6!3m5!1s0x414d0b2fc37086e3:0xf1cf44b4331d81d0!8m2!3d56.8466536!4d41.3764817!16s%2Fg%2F11gv_r_kkm?hl=ru"

    driver = setup_chrome_driver(headless=False)

    try:
        print(f"📍 Переходим на URL: {url}")
        driver.get(url)
        time.sleep(5)

        # Обрабатываем согласие
        try:
            consent_button = driver.find_element(By.CSS_SELECTOR, 'button[aria-label="Принять все"]')
            consent_button.click()
            print("✅ Согласие принято")
            time.sleep(15)
        except:
            print("ℹ️  Диалог согласия не найден")

        # Ищем и кликаем на вкладку отзывов
        try:
            tabs = driver.find_elements(By.CSS_SELECTOR, 'button[role="tab"]')
            for tab in tabs:
                aria_label = tab.get_attribute('aria-label')
                if aria_label and 'отзыв' in aria_label.lower():
                    print(f"✅ Найдена вкладка отзывов: {aria_label}")
                    tab.click()
                    time.sleep(10)
                    break
        except:
            print("❌ Вкладка отзывов не найдена")

        print("\n🔍 Анализ структуры страницы:")

        # Находим все div элементы и анализируем их классы
        all_divs = driver.find_elements(By.TAG_NAME, "div")
        print(f"  Всего div элементов: {len(all_divs)}")

        # Ищем элементы с подозрительными классами
        interesting_patterns = ['review', 'jftiEf', 'fontBody', 'MyEned', 'wiI7pd']

        for pattern in interesting_patterns:
            elements = driver.find_elements(By.CSS_SELECTOR, f"*[class*='{pattern}']")
            print(f"  Элементы с '{pattern}' в классе: {len(elements)}")

            if elements and len(elements) < 20:
                for i, elem in enumerate(elements[:5], 1):
                    try:
                        classes = elem.get_attribute('class')
                        text = elem.text.strip()[:100]
                        print(f"    #{i}: class='{classes}' text='{text}'")
                    except:
                        continue

        # Ищем элементы с data атрибутами
        data_elements = driver.find_elements(By.CSS_SELECTOR, "[data-review-id]")
        print(f"\n  Элементы с data-review-id: {len(data_elements)}")

        # Ищем элементы с aria-label содержащим имена
        aria_elements = driver.find_elements(By.CSS_SELECTOR, "*[aria-label]")
        print(f"  Элементы с aria-label: {len(aria_elements)}")

        name_elements = []
        for elem in aria_elements:
            try:
                aria_label = elem.get_attribute('aria-label')
                if aria_label and len(aria_label) > 10 and len(aria_label) < 100:
                    # Возможно это имя пользователя
                    if any(char.isalpha() for char in aria_label):
                        name_elements.append((elem, aria_label))
            except:
                continue

        print(f"  Возможные имена пользователей: {len(name_elements)}")
        for elem, aria_label in name_elements[:10]:
            print(f"    aria-label: '{aria_label}'")

        # Скролл для загрузки отзывов
        print(f"\n📜 Скроллинг для загрузки отзывов...")
        for i in range(3):
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)
            print(f"  Скролл #{i+1}")

        # Повторный анализ после скроллинга
        print(f"\n🔍 Повторный анализ после скроллинга:")
        for pattern in interesting_patterns:
            elements = driver.find_elements(By.CSS_SELECTOR, f"*[class*='{pattern}']")
            print(f"  Элементы с '{pattern}' в классе: {len(elements)}")

        # Сохраняем HTML для анализа
        page_html = driver.page_source
        with open('google_maps_debug.html', 'w', encoding='utf-8') as f:
            f.write(page_html)
        print(f"\n💾 HTML страницы сохранен в google_maps_debug.html")

        # Ждем для визуального осмотра
        print(f"\n⏳ Ожидание 60 секунд для визуального осмотра...")
        time.sleep(60)

    finally:
        driver.quit()
        print("\n✅ Браузер закрыт")

if __name__ == "__main__":
    debug_reviews_structure()