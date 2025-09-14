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
    "default_rating": 5.0,
    "consent_wait_time": 10,
    "tab_click_wait_time": 5,
    "page_reload_wait_time": 15,
    "text_expand_wait_time": 1,
    "element_load_wait_time": 5
}

# Настройки Chrome WebDriver
CHROME_OPTIONS = [
    "--headless",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-blink-features=AutomationControlled",
    "--disable-extensions",
    "--disable-plugins",
    "--disable-images",
    "--disable-javascript-harmony-shipping",
    "--disable-background-timer-throttling",
    "--disable-renderer-backgrounding",
    "--disable-backgrounding-occluded-windows",
    "--disable-ipc-flooding-protection",
    "--window-size=1920,1080",
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

# Селекторы для парсинга Google Maps
GOOGLE_SELECTORS = {
    # Кнопка согласия на обработку данных
    "consent_button": [
        'button[aria-label="Принять все"]',
        'button[jsname="b3VHJd"]',
        'button[aria-label*="Accept"]'
    ],

    # Вкладка с отзывами
    "reviews_tab": [
        'button[role="tab"][aria-label*="Отзывы"]',
        'button[data-tab-index="1"]',
        'button[role="tab"]'
    ],

    # Контейнер с отзывами для скроллинга
    "scrollable_containers": [
        'div.m6QErb.XiKgde',
        'div[class*="m6QErb"]',
        'div[aria-label*="Reviews"]',
        'div[class*="reviews-container"]'
    ],

    # Карточки отзывов
    "review_cards": [
        'div.jftiEf.fontBodyMedium',
        'div[class*="jftiEf"]',
        'div[data-review-id]',
        'div[jslog*="21866"]'
    ],

    # Имя автора отзыва
    "author": [
        'div.d4r55.fontTitleMedium',
        'button.al6Kxe div.d4r55',
        'div[class*="d4r55"]',
        '[class*="fontTitleMedium"]'
    ],

    # Аватарка пользователя
    "avatar": [
        'button.WEBjve img.NBa7we',
        'img.NBa7we',
        'img[class*="NBa7we"]'
    ],

    # Текст отзыва
    "text": [
        'div.MyEned span.wiI7pd',
        'span.wiI7pd',
        'div[class*="MyEned"]',
        '[class*="wiI7pd"]'
    ],

    # Кнопка "Ещё" для раскрытия полного текста
    "expand_button": [
        'button.w8nwRe.kyuRq',
        'button[aria-label="Ещё"]',
        'button:contains("Ещё")',
        'button[jsaction*="expandReview"]'
    ],

    # Дата отзыва
    "date": [
        'span.rsqaWe',
        'span[class*="rsqaWe"]',
        '[class*="date"]'
    ],

    # Рейтинг (количество звезд)
    "rating": [
        'span.kvMYJc[role="img"]',
        'span[aria-label*="звезд"]',
        'span[aria-label*="stars"]',
        '[class*="kvMYJc"]'
    ]
}

# Планировщик задач
SCHEDULER_CONFIG = {
    "daily_parse_hour": 2,
    "daily_parse_minute": 0
}