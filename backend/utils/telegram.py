"""
Утилиты для работы с Telegram Bot API.
Отправка уведомлений о новых заявках через телеграм бота.
"""
import requests
import os
import re
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

# Конфигурация Telegram бота
TELEGRAM_BOT_API_KEY = os.getenv("TELEGRAM_BOT_API_KEY")
TELEGRAM_SUPERGROUP_ID = os.getenv("TELEGRAM_SUPERGROUP_ID")
TELEGRAM_API_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_API_KEY}"


def format_phone_for_telegram(phone: str) -> str:
    """
    Форматирует номер телефона для Telegram - оставляет только + и цифры.

    Args:
        phone: Исходный номер телефона

    Returns:
        Отформатированный номер для Telegram
    """
    if not phone:
        return "Не указан"

    # Удаляем все символы кроме цифр и +
    clean_phone = re.sub(r'[^+\d]', '', phone)

    # Если номер начинается с 8, заменяем на +7
    if clean_phone.startswith('8'):
        clean_phone = '+7' + clean_phone[1:]
    elif clean_phone.startswith('7') and not clean_phone.startswith('+'):
        clean_phone = '+' + clean_phone
    elif not clean_phone.startswith('+') and len(clean_phone) >= 10:
        clean_phone = '+7' + clean_phone

    return clean_phone


def format_moscow_datetime(iso_timestamp: str) -> str:
    """
    Конвертирует ISO timestamp в человекочитаемый формат по московскому времени.

    Args:
        iso_timestamp: ISO формат времени (например, "2025-09-19T18:27:13.049Z")

    Returns:
        Отформатированное время (например, "19 Сентября 2025 21:30")
    """
    try:
        # Парсим ISO timestamp
        dt = datetime.fromisoformat(iso_timestamp.replace('Z', '+00:00'))

        # Конвертируем в московское время (UTC+3)
        moscow_tz = timezone(timedelta(hours=3))
        moscow_dt = dt.astimezone(moscow_tz)

        # Словарь месяцев на русском
        months = {
            1: 'Января', 2: 'Февраля', 3: 'Марта', 4: 'Апреля',
            5: 'Мая', 6: 'Июня', 7: 'Июля', 8: 'Августа',
            9: 'Сентября', 10: 'Октября', 11: 'Ноября', 12: 'Декабря'
        }

        # Форматируем в читаемый вид
        day = moscow_dt.day
        month = months[moscow_dt.month]
        year = moscow_dt.year
        hour = moscow_dt.hour
        minute = moscow_dt.minute

        return f"{day} {month} {year} {hour:02d}:{minute:02d}"

    except Exception as e:
        print(f"Ошибка форматирования времени: {e}")
        return iso_timestamp


def format_quiz_message(quiz_data: Dict[str, Any]) -> str:
    """
    Форматирует данные из квиза в красивое сообщение для Telegram.

    Args:
        quiz_data: Данные из квиза калькулятора

    Returns:
        Отформатированная строка сообщения
    """
    # Маппинг для человекочитаемых названий
    option_labels = {
        # Тип захоронения
        "funeral": "Похороны",
        "cremation": "Кремация",

        # Гроб/урна
        "economy": "Эконом",
        "standard": "Стандарт",
        "premium": "Премиум",

        # Принадлежности
        "wreath": "Венок",
        "cross": "Крест на могилу",
        "ribbons": "Траурные ленты",
        "clothes": "Одежда для усопшего",

        # Транспорт
        "yes": "Да",
        "no": "Нет"
    }

    # Заголовок сообщения
    message = "🔔 <b>Новая заявка с калькулятора</b>\n\n"

    # Контактная информация
    message += f"👤 <b>Имя:</b> {quiz_data.get('name', 'Не указано')}\n"

    # Форматируем телефон для возможности звонка в Telegram
    phone = quiz_data.get('phone', '')
    formatted_phone = format_phone_for_telegram(phone)
    message += f"📞 <b>Телефон:</b> {formatted_phone}\n\n"

    # Параметры заявки
    message += "📋 <b>Параметры заявки:</b>\n"

    # Тип захоронения
    burial_type = quiz_data.get('step_1')
    if burial_type:
        message += f"• Тип: {option_labels.get(burial_type, burial_type)}\n"

    # Гроб/урна
    coffin_type = quiz_data.get('step_2')
    if coffin_type:
        coffin_label = option_labels.get(coffin_type, coffin_type)
        if burial_type == "cremation":
            message += f"• Урна: {coffin_label}\n"
        else:
            message += f"• Гроб: {coffin_label}\n"

    # Принадлежности
    accessories = quiz_data.get('step_3', [])
    if accessories and isinstance(accessories, list) and len(accessories) > 0:
        accessories_labels = [option_labels.get(acc, acc) for acc in accessories]
        message += f"• Принадлежности: {', '.join(accessories_labels)}\n"

    # Транспорт
    transport = quiz_data.get('step_4')
    if transport:
        transport_label = "Автобус для гостей" if transport == "yes" else "Транспорт не нужен"
        message += f"• Транспорт: {transport_label}\n"

    # Время подачи заявки
    timestamp = quiz_data.get('timestamp')
    if timestamp:
        formatted_time = format_moscow_datetime(timestamp)
        message += f"\n🕐 <b>Время заявки:</b> {formatted_time}\n"

    message += "\n💡 <i>Необходимо связаться с клиентом в течение 5 минут</i>"

    return message


async def send_telegram_message(message: str, chat_id: Optional[str] = None) -> bool:
    """
    Отправляет сообщение в Telegram чат.

    Args:
        message: Текст сообщения
        chat_id: ID чата (если не указан, используется TELEGRAM_SUPERGROUP_ID)

    Returns:
        True если сообщение отправлено успешно, False в противном случае
    """
    if not TELEGRAM_BOT_API_KEY or not TELEGRAM_SUPERGROUP_ID:
        raise ValueError("Telegram API ключ или ID группы не настроены")

    target_chat_id = chat_id or TELEGRAM_SUPERGROUP_ID

    url = f"{TELEGRAM_API_URL}/sendMessage"

    payload = {
        "chat_id": target_chat_id,
        "text": message,
        "parse_mode": "HTML",
        "disable_web_page_preview": True
    }

    try:
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()

        result = response.json()

        if result.get("ok"):
            return True
        else:
            print(f"Telegram API ошибка: {result.get('description', 'Неизвестная ошибка')}")
            return False

    except requests.exceptions.RequestException as e:
        print(f"Ошибка отправки в Telegram: {str(e)}")
        return False
    except Exception as e:
        print(f"Неожиданная ошибка: {str(e)}")
        return False


async def send_quiz_notification(quiz_data: Dict[str, Any]) -> bool:
    """
    Отправляет уведомление о новой заявке из квиза в Telegram.

    Args:
        quiz_data: Данные из квиза калькулятора

    Returns:
        True если уведомление отправлено успешно, False в противном случае
    """
    try:
        message = format_quiz_message(quiz_data)
        return await send_telegram_message(message)
    except Exception as e:
        print(f"Ошибка отправки уведомления о заявке: {str(e)}")
        return False


def test_telegram_connection() -> bool:
    """
    Тестирует подключение к Telegram боту.

    Returns:
        True если бот доступен, False в противном случае
    """
    if not TELEGRAM_BOT_API_KEY:
        return False

    url = f"{TELEGRAM_API_URL}/getMe"

    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()

        result = response.json()
        return result.get("ok", False)

    except Exception:
        return False