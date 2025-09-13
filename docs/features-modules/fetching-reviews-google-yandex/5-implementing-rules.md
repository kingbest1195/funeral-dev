Раздел 5: Финальная Сборка: Инструкции для ИИ-Агента
Этот раздел представляет собой консолидированное руководство для ИИ-агента по развертыванию и настройке всего функционала.

5.1. Структура Проекта и Установка
Рекомендуется следующая структура директорий в корне проекта:

/project-root
├── /backend
│ ├── main.py
│ ├── cron_fetch_reviews.py
│ ├── requirements.txt
│ └──.env
├── /frontend
│ ├── src/
│ ├── package.json
│ └──...
└──...
Команды для инициализации:

Бэкенд: python -m venv venv, pip install fastapi uvicorn sqlalchemy httpx google-api-python-client python-dotenv

Фронтенд: npm create vite@latest frontend -- --template react, cd frontend, npm install

5.2. Конфигурация Окружения (.env)
Перед началом работы пользователь должен подготовить файл .env в директории /backend со следующими переменными. Это наиболее важный шаг, так как он содержит все секреты и конфигурационные параметры, необходимые для работы системы.

Таблица 2: Обязательные учетные данные и переменные окружения

Переменная Описание и Инструкция по получению Пример значения
DATABASE_URL Путь к файлу базы данных SQLite. Относительный путь от корня бэкенда. sqlite:///./reviews.db
GOOGLE_CREDENTIALS_JSON_PATH Путь к файлу credentials.json, скачанному из Google Cloud Console для сервисного аккаунта. path/to/your/credentials.json
GOOGLE_ACCOUNT_ID Уникальный ID вашего аккаунта в Google Business Profile. Найти в URL панели управления GBP. 123456789012345678901
GOOGLE_LOCATION_IDS Список ID филиалов через запятую. Найти в URL панели управления для каждого филиала. 1111111111,2222222222
YANDEX_URLS="https://yandex.ru/maps/org/vek/...,https://yandex.ru/maps/org/vek/..."

Export to Sheets
5.3. Команды для Установки и Запуска
Бэкенд:

Перейти в директорию: cd backend

Активировать виртуальное окружение: source venv/bin/activate (для Linux/macOS) или venv\Scripts\activate (для Windows)

Установить зависимости: pip install -r requirements.txt

Запустить сервер для разработки: uvicorn main:app --reload

Фронтенд:

Перейти в директорию: cd frontend

Установить зависимости: npm install

Запустить сервер для разработки: npm run dev
