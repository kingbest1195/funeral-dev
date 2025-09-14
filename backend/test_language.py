#!/usr/bin/env python3
"""
Тестовый скрипт для проверки языка Google Maps.
"""
import sys
import os
import time

# Добавляем текущую директорию в путь для импорта модулов
sys.path.insert(0, os.path.dirname(__file__))

from utils.selenium_utils import setup_chrome_driver
from selenium.webdriver.common.by import By

def test_language():
    """Тестируем какой язык открывается на сайте."""
    print("🔍 Тестирование языка Google Maps...")
    print("=" * 60)

    url = "https://www.google.com/maps/place/Vek+Ritual%27naya+Sluzhba/@56.8576325,41.4019962,13z/data=!4m6!3m5!1s0x414d0b2fc37086e3:0xf1cf44b4331d81d0!8m2!3d56.8466536!4d41.3764817!16s%2Fg%2F11gv_r_kkm?hl=ru&amp;entry=ttu&amp;g_ep=EgoyMDI1MDkxMC4wIKXMDSoASAFQAw%3D%3D"

    driver = setup_chrome_driver(headless=False)  # Открываем видимый браузер

    try:
        print(f"📍 Переходим на URL: {url}")
        driver.get(url)

        # Ждем загрузки страницы
        time.sleep(10)

        # Проверяем заголовок H1
        try:
            h1_elements = driver.find_elements(By.TAG_NAME, "h1")
            print(f"\n🔍 Найдено H1 элементов: {len(h1_elements)}")

            for i, h1 in enumerate(h1_elements, 1):
                text = h1.text.strip()
                if text:
                    print(f"  H1 #{i}: '{text}'")

                    if "Век Ритуальная Служба" in text:
                        print("  ✅ Найден русский заголовок - язык корректный!")
                    elif "Vek" in text and "Ritual" in text:
                        print("  ❌ Найден английский заголовок - нужно исправлять язык!")

                    # Показываем HTML структуру
                    print(f"  HTML: {h1.get_attribute('outerHTML')[:200]}...")

        except Exception as e:
            print(f"⚠️  Ошибка при поиске H1: {e}")

        # Проверяем текущий URL для понимания языка
        current_url = driver.current_url
        print(f"\n🌐 Текущий URL: {current_url}")

        if "hl=ru" in current_url:
            print("  ✅ Параметр hl=ru присутствует в URL")
        else:
            print("  ❌ Параметр hl=ru отсутствует в URL")

        # Проверяем кнопки согласия
        try:
            consent_buttons = driver.find_elements(By.CSS_SELECTOR, "button")
            print(f"\n🔍 Найдено кнопок: {len(consent_buttons)}")

            for button in consent_buttons[:10]:  # Проверяем первые 10 кнопок
                try:
                    text = button.text.strip()
                    aria_label = button.get_attribute('aria-label')

                    if text and ('принять' in text.lower() or 'accept' in text.lower() or
                                'согласие' in text.lower() or 'consent' in text.lower()):
                        print(f"  Кнопка согласия: '{text}' (aria-label: '{aria_label}')")

                        if 'принять' in text.lower() or 'согласие' in text.lower():
                            print("    ✅ Русская кнопка найдена!")
                        else:
                            print("    ❌ Английская кнопка - нужно исправлять язык!")
                except:
                    continue

        except Exception as e:
            print(f"⚠️  Ошибка при поиске кнопок: {e}")

        # Ждем, чтобы можно было посмотреть на страницу
        print(f"\n⏳ Ожидание 30 секунд для визуального осмотра...")
        time.sleep(30)

    finally:
        driver.quit()
        print("\n✅ Браузер закрыт")

if __name__ == "__main__":
    test_language()