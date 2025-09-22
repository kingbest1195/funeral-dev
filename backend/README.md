# Backend для системы сбора отзывов

Бэкенд приложение для автоматического сбора отзывов с Яндекс и Google карт.

## Установка и настройка

### 1. Установка зависимостей

```bash
cd backend
pip install -r requirements.txt
```

### 2. Настройка переменных окружения

Убедитесь, что файл `.env` содержит необходимые переменные:

```env
# --- Yandex ---
YANDEX_URLS="url1,url2"
YANDEX_API_KEY="your-api-key"

# --- Google ---
GOOGLE_URLS="url1,url2"

# --- Database ---
DATABASE_NAME="reviews.db"

# --- Telegram bot ---
TELEGRAM_BOT_API_KEY="your-bot-token"
TELEGRAM_SUPERGROUP_ID="your-chat-id"
```

### 3. Инициализация базы данных

```bash
python run.py init
# или
python database.py
```

## Запуск приложения

### Режим разработки

```bash
python main.py
```

Сервер будет доступен по адресу: `http://localhost:8000`

### Режим production

```bash
# Через Gunicorn (рекомендуется)
gunicorn --config gunicorn_config.py main:app

# Или через uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### Основные endpoints

- `GET /` - Проверка работы API
- `GET /health` - Проверка состояния сервиса
- `GET /api/reviews` - Получение отзывов (с пагинацией и сортировкой)
- `GET /api/reviews/count` - Количество отзывов
- `POST /api/reviews/fetch-yandex` - Ручной запуск сбора отзывов
- `POST /api/quiz/submit` - Отправка заявки из калькулятора (передает данные в Telegram)
- `GET /api/telegram/test` - Тестирование соединения с Telegram ботом

### Параметры для `/api/reviews`

- `limit` - количество отзывов (по умолчанию 10)
- `offset` - смещение для пагинации (по умолчанию 0)
- `source` - фильтр по источнику ('yandex' или 'google')

Пример:
```
GET /api/reviews?limit=5&source=yandex
```

### Управление планировщиком

- `GET /api/scheduler/status` - Статус планировщика и задач

## Тестирование

### Утилита для тестирования

```bash
# Интерактивное меню
python run.py

# Команды напрямую
python run.py init    # Инициализация БД
python run.py parse   # Тестовый сбор отзывов
python run.py show    # Просмотр отзывов
python run.py clear   # Очистка БД
```

### Тестирование парсера

```bash
# Запуск только парсера Яндекс
python yandex_parser.py
```

## Структура проекта

```
backend/
├── main.py              # FastAPI приложение
├── database.py          # Модели базы данных
├── yandex_parser.py     # Парсер отзывов Яндекс карт
├── run.py              # Утилиты для тестирования
├── requirements.txt     # Зависимости Python
├── .env                # Переменные окружения
└── reviews.db          # База данных SQLite (создается автоматически)
```

## Функционал

### Автоматический сбор отзывов

- **Планировщик**: Запускается каждый день в 02:00
- **Источники**: Яндекс карты (Google карты - в разработке)
- **Дедупликация**: Проверка на дубликаты по автору и тексту
- **Сортировка**: По длине текста (убывание) → дате публикации (убывание)

### База данных

Модель `Review`:
- `id` - уникальный идентификатор
- `source` - источник ('yandex' или 'google')
- `author_name` - имя автора
- `author_avatar_url` - URL аватара автора
- `review_text` - текст отзыва
- `rating` - рейтинг
- `publish_date` - дата публикации отзыва
- `created_at` - дата добавления в БД

### Безопасность

- CORS настроен для фронтенд доменов
- Headless браузер для парсинга
- Защита от автоматического определения бота

## Логирование

Все операции логируются в консоль:
- Запуск и остановка сервиса
- Результаты сбора отзывов
- Ошибки парсинга
- Статус планировщика

## Развертывание на продакшн сервере

### Конфигурация сервера

**Адрес:** 217.198.13.70
**Домен API:** api.xn----7sbhmlqd1btk.xn--p1ai (api.ритуал-век.рф)
**SSL:** Let's Encrypt автообновление

### Архитектура

```
Frontend (Yandex Cloud S3) → Nginx (HTTPS) → Gunicorn → FastAPI
```

### Nginx конфигурация

Файл: `/etc/nginx/sites-available/funeral-api`
- HTTPS обязателен (HTTP редиректит на HTTPS)
- Проксирование на localhost:8000
- SSL сертификаты от Let's Encrypt
- CORS заголовки для домена сайта

### Gunicorn конфигурация

Файл: `gunicorn_config.py`
- 4 воркера (CPU cores × 2 + 1)
- UvicornWorker для async поддержки
- Логи в `/var/log/gunicorn/`
- Автоперезагрузка воркеров каждые 1000 запросов

### Служебные команды

```bash
# Проверка статуса
ps aux | grep gunicorn
systemctl status nginx

# Перезапуск
pkill -f gunicorn
gunicorn --config gunicorn_config.py main:app --daemon

# Логи
tail -f /var/log/gunicorn/error.log
tail -f /var/log/nginx/funeral-api.access.log
```

### Мониторинг

- **Health check:** `GET /health`
- **Telegram test:** `GET /api/telegram/test`
- **Логи ошибок:** `/var/log/gunicorn/error.log`
- **Доступ к API:** `/var/log/nginx/funeral-api.access.log`

## Возможные проблемы

1. **ChromeDriver не найден**: Устанавливается автоматически через `webdriver-manager`
2. **Блокировка Яндексом**: Используется ротация User-Agent и headless режим
3. **Изменение структуры страниц**: Парсер использует множественные селекторы для устойчивости
4. **500 ошибки quiz/submit**: Проверить наличие файла `.env` и корректность Telegram переменных
5. **Проблемы с CORS**: Убедиться что Origin заголовок соответствует разрешенному домену