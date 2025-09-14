"""
Утилиты для парсинга дат из различных источников.
"""
import re
import random
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


def parse_google_date(date_str: str) -> datetime:
    """
    Парсит дату из Google Maps с добавлением случайности.
    Поддерживает форматы: "год назад", "3 года назад", "7 месяцев назад"

    Args:
        date_str: Строка с датой на русском языке

    Returns:
        datetime: Распарсенная дата с рандомизацией
    """
    date_str = date_str.lower().strip()
    now = datetime.now()

    # Извлекаем число и период
    period_match = re.search(r'(\d+)?\s*(год|года|лет|месяц|месяца|месяцев|день|дня|дней|неделю|недели|недель)\s*назад', date_str)

    if period_match:
        # Получаем значение периода (если не указано, то 1)
        period_value = int(period_match.group(1)) if period_match.group(1) else 1
        period_label = period_match.group(2)

        print(f"Парсинг даты Google: '{date_str}' -> период: {period_value} {period_label}")

        if "год" in period_label or "лет" in period_label:
            # Год назад - добавляем рандом в месяц (±3) и день (1-28)
            base_date = now - timedelta(days=period_value * 365)
            random_months = random.randint(-3, 3)
            random_days = random.randint(1, 28)

            try:
                # Вычисляем новый месяц
                new_month = base_date.month + random_months
                new_year = base_date.year

                # Корректируем год, если месяц выходит за пределы
                if new_month > 12:
                    new_month -= 12
                    new_year += 1
                elif new_month < 1:
                    new_month += 12
                    new_year -= 1

                final_date = datetime(new_year, new_month, random_days)
                print(f"  Результат: {final_date.strftime('%d.%m.%Y')}")
                return final_date

            except ValueError:
                # Если не получилось создать дату, используем базовую
                final_date = base_date.replace(day=random_days)
                print(f"  Результат (fallback): {final_date.strftime('%d.%m.%Y')}")
                return final_date

        elif "месяц" in period_label:
            # Месяц назад - добавляем рандом в день (±7)
            base_date = now - timedelta(days=period_value * 30)
            random_days = random.randint(-7, 7)
            final_date = base_date + timedelta(days=random_days)
            print(f"  Результат: {final_date.strftime('%d.%m.%Y')}")
            return final_date

        elif "неделю" in period_label or "недели" in period_label or "недель" in period_label:
            # Неделя назад - добавляем рандом в день (±2)
            base_date = now - timedelta(weeks=period_value)
            random_days = random.randint(-2, 2)
            final_date = base_date + timedelta(days=random_days)
            print(f"  Результат: {final_date.strftime('%d.%m.%Y')}")
            return final_date

        elif "день" in period_label or "дня" in period_label or "дней" in period_label:
            # День назад - без рандомизации
            final_date = now - timedelta(days=period_value)
            print(f"  Результат: {final_date.strftime('%d.%m.%Y')}")
            return final_date

    # Если не удалось распарсить, возвращаем текущую дату
    print(f"  Не удалось распарсить дату: '{date_str}', используется текущая")
    return now