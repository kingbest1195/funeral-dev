"""
Утилиты для работы с Selenium WebDriver.
"""
import re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.common.exceptions import WebDriverException
from webdriver_manager.chrome import ChromeDriverManager
from config.constants import CHROME_OPTIONS


def setup_chrome_driver(headless: bool = True) -> webdriver.Chrome:
    """
    Настраивает и возвращает Chrome WebDriver.

    Args:
        headless: Запускать ли в headless режиме

    Returns:
        webdriver.Chrome: Настроенный драйвер

    Raises:
        WebDriverException: Если не удалось инициализировать драйвер
    """
    options = webdriver.ChromeOptions()

    # Добавляем стандартные опции
    for option in CHROME_OPTIONS:
        if option == "--headless" and not headless:
            continue  # Пропускаем headless если отключен
        options.add_argument(option)

    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)

    try:
        # Пробуем использовать системный ChromeDriver
        try:
            driver = webdriver.Chrome(options=options)
            driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            print("✅ Используем системный ChromeDriver")
            return driver
        except Exception as e1:
            print(f"Системный ChromeDriver не найден: {e1}")

            # Если системный не работает, пробуем webdriver-manager
            try:
                driver = webdriver.Chrome(
                    service=ChromeService(ChromeDriverManager().install()),
                    options=options
                )
                driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
                print("✅ Используем ChromeDriver через webdriver-manager")
                return driver
            except Exception as e2:
                print(f"Webdriver-manager тоже не работает: {e2}")
                raise WebDriverException("❌ Не удалось инициализировать браузер")

    except Exception as e:
        raise WebDriverException(f"Общая ошибка инициализации WebDriver: {e}")


def extract_background_image_url(style_attr: str) -> str:
    """
    Извлекает URL из CSS background-image.

    Args:
        style_attr: Значение атрибута style

    Returns:
        str: URL изображения или None
    """
    if not style_attr:
        return None

    url_match = re.search(r'background-image\s*:\s*url\s*\(\s*["\']?(.*?)["\']?\s*\)', style_attr)
    return url_match.group(1) if url_match else None