"""
Утилиты для парсинга дат из различных источников.
"""
import re
from datetime import datetime, timedelta
from config.constants import RUSSIAN_MONTHS


def parse_yandex_date(date_str: str) -> datetime:
    """
    Парсит дату из Яндекс карт.
    Поддерживает форматы: "вчера", "2 дня назад", "неделю назад", "месяц назад", "ДД месяца ГГГГ"

    Args:
        date_str: Строка с датой на русском языке

    Returns:
        datetime: Распарсенная дата
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
    for month_name, month_num in RUSSIAN_MONTHS.items():
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