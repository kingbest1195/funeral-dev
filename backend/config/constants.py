"""
Константы и настройки приложения.
"""

# Селекторы для парсинга Яндекс карт
YANDEX_SELECTORS = {
    "review_cards": [
        'div[data-testid="business-review-view"]',
        'div[class*="business-review-view"]',
        '.business-review-view',
        'div[class*="review"]'
    ],
    "author": [
        'span[itemprop="name"]',
        '.user-name',
        '[class*="user-name"]',
        '[data-testid="review-author"]'
    ],
    "text": [
        'div[itemprop="reviewBody"]',
        'span.business-review-view__body-text',
        '[class*="review-text"]',
        '[class*="body-text"]',
        '[data-testid="review-text"]'
    ],
    "date": [
        'span.business-review-view__date',
        '[class*="review-date"]',
        '[class*="date"]',
        '[data-testid="review-date"]'
    ],
    "avatar": '.user-icon-view__icon',
    "scrollable_containers": [
        'div[class*="business-reviews-card-view__reviews-list"]',
        'div[class*="scroll-container"]',
        'div[data-testid="reviews-list"]',
        '.business-reviews-card-view'
    ]
}

# Настройки парсинга
PARSING_CONFIG = {
    "max_stable_attempts": 5,
    "scroll_delay": 2,
    "page_load_timeout": 15,
    "default_rating": 5.0
}

# Настройки Chrome WebDriver
CHROME_OPTIONS = [
    "--headless",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-blink-features=AutomationControlled",
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
]

# Карта месяцев для парсинга русских дат
RUSSIAN_MONTHS = {
    'января': 1, 'февраля': 2, 'марта': 3, 'апреля': 4, 'мая': 5, 'июня': 6,
    'июля': 7, 'августа': 8, 'сентября': 9, 'октября': 10, 'ноября': 11, 'декабря': 12
}

# API настройки
API_CONFIG = {
    "cors_origins": ["http://localhost:3000", "http://localhost:5173"],
    "default_page_size": 10,
    "max_page_size": 100
}

# Планировщик задач
SCHEDULER_CONFIG = {
    "daily_parse_hour": 2,
    "daily_parse_minute": 0
}