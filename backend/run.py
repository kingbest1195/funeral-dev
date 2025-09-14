"""
Утилита для запуска и тестирования системы сбора отзывов.
"""
import sys
import asyncio
from database import init_db, get_session, Review
from yandex_parser import fetch_and_save_yandex_reviews

def setup_database():
    """Инициализация базы данных."""
    print("Инициализация базы данных...")
    init_db()
    print("База данных готова к работе.")

def test_yandex_parser():
    """Тестовый запуск парсера Яндекс карт."""
    print("Запуск тестового сбора отзывов из Яндекс карт...")
    fetch_and_save_yandex_reviews()
    print("Тестовый сбор завершен.")

def show_reviews():
    """Показать все отзывы из базы данных."""
    session = get_session()
    try:
        reviews = session.query(Review).order_by(Review.created_at.desc()).all()

        if not reviews:
            print("В базе данных пока нет отзывов.")
            return

        print(f"\nВсего отзывов в базе: {len(reviews)}\n")

        for i, review in enumerate(reviews[:10], 1):  # Показываем первые 10
            print(f"--- Отзыв #{i} ---")
            print(f"Источник: {review.source}")
            print(f"Автор: {review.author_name}")
            print(f"Дата публикации: {review.publish_date}")
            print(f"Текст: {review.review_text[:100]}{'...' if len(review.review_text) > 100 else ''}")
            print(f"Рейтинг: {review.rating}")
            print(f"Добавлен: {review.created_at}")
            print("-" * 50)

        if len(reviews) > 10:
            print(f"... и еще {len(reviews) - 10} отзывов")

    finally:
        session.close()

def clear_database():
    """Очистить все отзывы из базы данных."""
    confirm = input("Вы уверены, что хотите удалить ВСЕ отзывы? (yes/no): ")
    if confirm.lower() != 'yes':
        print("Операция отменена.")
        return

    session = get_session()
    try:
        count = session.query(Review).count()
        session.query(Review).delete()
        session.commit()
        print(f"Удалено {count} отзывов из базы данных.")
    finally:
        session.close()

def main():
    """Главное меню утилиты."""
    while True:
        print("\n=== Система сбора отзывов ===")
        print("1. Инициализировать базу данных")
        print("2. Тестовый сбор отзывов из Яндекс карт")
        print("3. Показать отзывы из базы")
        print("4. Очистить базу данных")
        print("5. Выход")
        print("=" * 30)

        choice = input("Выберите действие (1-5): ").strip()

        if choice == '1':
            setup_database()
        elif choice == '2':
            test_yandex_parser()
        elif choice == '3':
            show_reviews()
        elif choice == '4':
            clear_database()
        elif choice == '5':
            print("Завершение работы.")
            break
        else:
            print("Неверный выбор. Попробуйте снова.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        if command == 'init':
            setup_database()
        elif command == 'parse':
            test_yandex_parser()
        elif command == 'show':
            show_reviews()
        elif command == 'clear':
            clear_database()
        else:
            print("Доступные команды: init, parse, show, clear")
    else:
        main()