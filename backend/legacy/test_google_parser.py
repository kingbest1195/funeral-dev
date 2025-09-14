#!/usr/bin/env python3
"""
Тестовый скрипт для Google парсера.
"""
import sys
import os

# Добавляем текущую директорию в путь для импорта модулей
sys.path.insert(0, os.path.dirname(__file__))

from parsers.google_parser import GoogleReviewsParser

def main():
    """Запуск тестирования Google парсера."""
    print("🚀 Запуск тестирования Google Maps парсера...")
    print("=" * 60)

    try:
        with GoogleReviewsParser() as parser:
            total_reviews = parser.fetch_all_reviews()
            print(f"\n🎉 Тестирование завершено! Собрано отзывов: {total_reviews}")

    except Exception as e:
        print(f"❌ Ошибка при тестировании: {e}")
        return False

    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)