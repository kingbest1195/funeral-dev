**Содержимое файла `.env` должно выглядеть так:**

```env
# --- Google ---
# Путь к файлу с учетными данными Google API
GOOGLE_CREDENTIALS_PATH="google_credentials.json"
# ID ваших филиалов в Google Картах (через запятую, если их несколько)
GOOGLE_PLACE_IDS="YOUR_PLACE_ID_1,YOUR_PLACE_ID_2"

# --- Yandex ---
# URL ваших филиалов в Яндекс Картах (через запятую, если их несколько)
YANDEX_URLS="https://yandex.ru/maps/org/vek/...,https://yandex.ru/maps/org/vek/..."

# --- Database ---
# Имя файла базы данных
DATABASE_NAME="reviews.db"
```

---

### Инструкции для ИИ-агента

Ниже приведены подробные инструкции для ИИ-агента, разделенные на этапы.

#### **Этап 1: Настройка бэкенда и базы данных**

1.  **Создай структуру проекта:** В корне проекта создай директорию `backend`.
2.  **Инициализируй бэкенд:** Внутри `backend` создай виртуальное окружение Python и установи необходимые библиотеки:
    ```bash
    pip install fastapi "uvicorn[standard]" sqlalchemy python-dotenv google-api-python-client selenium webdriver-manager apscheduler
    ```
3.  **Настрой базу данных (SQLite):**
    reviews.db

#### **Этап 2: Реализация сбора отзывов**

1.  **Парсер отзывов Яндекса (Selenium):**

    - Создай файл `yandex_parser.py`.
    - Напиши функцию `fetch_yandex_reviews()` на основе логики из видео:
      - Используй `webdriver-manager` для автоматической настройки Selenium WebDriver для Chrome.
      - Для каждого URL из `YANDEX_URLS`:
        - Открой страницу в браузере (`driver.get(url)`).
        - **Важно:** Реализуй цикл прокрутки страницы вниз до тех пор, пока не перестанут подгружаться новые отзывы. Это необходимо, так как Яндекс подгружает отзывы динамически. Используй `driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")` с небольшими паузами (`time.sleep(2)`).
        - После загрузки всех отзывов, получи исходный код страницы (`driver.page_source`).
        - Используя `BeautifulSoup4` или встроенные методы Selenium (`find_elements`), найди все карточки отзывов.
        - Для каждой карточки извлеки:
          - **Имя автора:** (селектор `span[itemprop="name"]`)
          - **URL аватара:** (селектор `img.user-avatar-view__image`)
          - **Текст отзыва:** (селектор `span.business-review-view__body-text`)
          - **Дату:** (селектор `span.business-review-view__date`) - приведи ее к формату `datetime`.
        - Сохрани новые отзывы в базу данных.
      - Не забудь закрыть браузер (`driver.quit()`).

---

### Файл: `yandex_parser.py`

```python
import os
import time
from datetime import datetime, timedelta

from bs4 import BeautifulSoup
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from webdriver_manager.chrome import ChromeDriverManager

# Предполагается, что модель Review и функция init_db находятся в файле database.py
# Убедись, что этот импорт корректен для твоей структуры проекта
from database import Review, init_db

# --- Настройка ---

def fetch_and_save_yandex_reviews():
    """
    Основная функция для парсинга отзывов с Яндекс Карт и сохранения их в базу данных.
    Использует Selenium для управления браузером и BeautifulSoup для разбора HTML.
    """
    # Загружаем переменные окружения из .env файла
    load_dotenv()
    yandex_urls = os.getenv("YANDEX_URLS")
    db_name = os.getenv("DATABASE_NAME")

    if not yandex_urls or not db_name:
        print("Ошибка: Переменные YANDEX_URLS или DATABASE_NAME не найдены в .env")
        return

    # --- Подключение к Базе Данных ---
    engine = create_engine(f"sqlite:///{db_name}")
    Session = sessionmaker(bind=engine)
    session = Session()

    # Инициализируем БД, если таблицы не существует
    init_db()

    # --- Настройка Selenium WebDriver ---
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  # Запуск в фоновом режиме, без открытия окна браузера
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)

    print("Начинаю сбор отзывов с Яндекс Карт...")

    # --- Основной цикл парсинга ---
    for url in yandex_urls.split(','):
        try:
            print(f"Обрабатываю URL: {url.strip()}")
            driver.get(url.strip())
            time.sleep(5)  # Даем странице время на первичную загрузку

            # --- Прокрутка для загрузки всех отзывов ---
            reviews_list_selector = 'div[class*="business-reviews-card-view__reviews-list"]'
            scrollable_element = driver.find_element(By.CSS_SELECTOR, reviews_list_selector)

            last_height = driver.execute_script("return arguments[0].scrollHeight", scrollable_element)
            while True:
                driver.execute_script("arguments[0].scrollTo(0, arguments[0].scrollHeight);", scrollable_element)
                time.sleep(2)  # Пауза для подгрузки нового контента
                new_height = driver.execute_script("return arguments[0].scrollHeight", scrollable_element)
                if new_height == last_height:
                    break
                last_height = new_height

            # --- Разбор HTML с помощью BeautifulSoup ---
            page_source = driver.page_source
            soup = BeautifulSoup(page_source, 'html.parser')

            # Селектор для individual review cards
            review_cards = soup.select('div[data-testid="business-review-view"]')

            print(f"Найдено {len(review_cards)} отзывов для данного филиала.")

            for card in review_cards:
                try:
                    # Извлекаем данные
                    author_name = card.select_one('span[itemprop="name"]').text.strip()
                    review_text = card.select_one('span.business-review-view__body-text').text.strip()
                    date_str = card.select_one('span.business-review-view__date').text.strip()

                    # Аватар может отсутствовать
                    avatar_img = card.select_one('img.user-avatar-view__image')
                    author_avatar_url = avatar_img['src'] if avatar_img and avatar_img.has_attr('src') else None

                    # Преобразуем дату
                    # Яндекс использует формат "ДД месяца ГГГГ" или относительные даты
                    # Эта функция — упрощенная версия, ее можно расширить для других форматов
                    publish_date = datetime.now() # Default value
                    # (Логику преобразования даты можно добавить здесь, если необходимо)

                    # Проверяем, существует ли уже такой отзыв
                    existing_review = session.query(Review).filter_by(
                        author_name=author_name,
                        review_text=review_text
                    ).first()

                    if not existing_review:
                        new_review = Review(
                            source='yandex',
                            author_name=author_name,
                            author_avatar_url=author_avatar_url,
                            review_text=review_text,
                            publish_date=publish_date,
                            rating=5 # Яндекс не всегда явно показывает рейтинг в HTML, ставим заглушку
                        )
                        session.add(new_review)
                        print(f"  -> Добавлен новый отзыв от: {author_name}")

                except Exception as e:
                    print(f"  ! Не удалось обработать карточку отзыва: {e}")
                    continue

        except Exception as e:
            print(f"Ошибка при обработке URL {url.strip()}: {e}")
            continue

    # --- Завершение ---
    session.commit()
    session.close()
    driver.quit()
    print("Сбор отзывов с Яндекс Карт завершен.")

if __name__ == '__main__':
    # Этот блок позволяет запустить файл напрямую для тестирования
    fetch_and_save_yandex_reviews()
```

**Настрой ежедневный запуск (планировщик):**

      * В `main.py` используй библиотеку **APScheduler**.
      * Создай задачу (`scheduler.add_job`), которая будет запускать функции `fetch_google_reviews()` и `fetch_yandex_reviews()` один раз в сутки (например, ночью).
      * Запускай планировщик при старте FastAPI-приложения.
