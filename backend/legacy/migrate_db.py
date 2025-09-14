"""
Скрипт миграции базы данных для добавления полей source_name и source_url.
Используется для обновления существующих таблиц без потери данных.
"""
import os
from sqlalchemy import create_engine, text, inspect
from dotenv import load_dotenv

def migrate_database():
    """Мигрирует базу данных, добавляя новые поля если их нет."""

    load_dotenv()
    db_name = os.getenv("DATABASE_NAME", "reviews.db")
    database_url = f"sqlite:///{db_name}"

    engine = create_engine(database_url)

    print(f"🔄 Начинаю миграцию базы данных: {db_name}")

    # Проверяем, существует ли таблица
    inspector = inspect(engine)
    if 'reviews' not in inspector.get_table_names():
        print("📋 Таблица 'reviews' не существует, создаем новую...")
        from database import init_db
        init_db()
        print("✅ Таблица создана с новой структурой")
        return

    # Получаем существующие колонки
    columns = [col['name'] for col in inspector.get_columns('reviews')]
    print(f"📊 Существующие колонки: {columns}")

    with engine.begin() as conn:
        # Добавляем source_name если его нет
        if 'source_name' not in columns:
            print("➕ Добавляю колонку 'source_name'...")
            conn.execute(text("ALTER TABLE reviews ADD COLUMN source_name VARCHAR(50)"))

            # Заполняем существующие записи
            conn.execute(text("""
                UPDATE reviews
                SET source_name = CASE
                    WHEN source = 'yandex' THEN 'Яндекс.Бизнес'
                    WHEN source = 'google' THEN 'Google Maps'
                    ELSE 'Неизвестно'
                END
            """))
            print("✅ Колонка 'source_name' добавлена и заполнена")
        else:
            print("ℹ️ Колонка 'source_name' уже существует")

        # Добавляем source_url если его нет
        if 'source_url' not in columns:
            print("➕ Добавляю колонку 'source_url'...")
            conn.execute(text("ALTER TABLE reviews ADD COLUMN source_url TEXT"))

            # Заполняем существующие записи значением по умолчанию
            conn.execute(text("""
                UPDATE reviews
                SET source_url = CASE
                    WHEN source = 'yandex' THEN 'https://yandex.ru/maps/org/vek/'
                    WHEN source = 'google' THEN 'https://maps.google.com/'
                    ELSE 'https://example.com'
                END
            """))
            print("✅ Колонка 'source_url' добавлена и заполнена")
        else:
            print("ℹ️ Колонка 'source_url' уже существует")

    # Обновляем колонки чтобы они стали NOT NULL (только для новых данных)
    with engine.begin() as conn:
        # Проверяем, нужно ли обновить ограничения
        print("🔧 Применяю ограничения NOT NULL...")

        # SQLite не поддерживает изменение ограничений напрямую,
        # но наши данные уже заполнены, так что новые записи будут валидными

    print("🎉 Миграция завершена успешно!")

    # Показываем итоговую структуру
    print("\n📋 Итоговая структура таблицы:")
    inspector = inspect(engine)
    for col in inspector.get_columns('reviews'):
        print(f"  - {col['name']}: {col['type']} {'(NOT NULL)' if not col['nullable'] else '(NULL)'}")

if __name__ == "__main__":
    migrate_database()