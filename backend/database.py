"""
Модуль для работы с базой данных отзывов.
Содержит модель Review и функции для инициализации БД.
Оптимизированная версия с улучшенной архитектурой.
"""
import os
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

Base = declarative_base()

class Review(Base):
    """Модель отзыва в базе данных."""
    __tablename__ = 'reviews'

    id = Column(Integer, primary_key=True, autoincrement=True)
    source = Column(String(20), nullable=False)  # 'yandex' или 'google'
    source_name = Column(String(50), nullable=False)  # 'Яндекс.Бизнес' или 'Google Maps'
    source_url = Column(Text, nullable=False)  # URL источника отзыва
    author_name = Column(String(255), nullable=False)
    author_avatar_url = Column(Text, nullable=True)
    review_text = Column(Text, nullable=False)
    rating = Column(Float, nullable=True)
    publish_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"<Review(id={self.id}, source='{self.source}', author='{self.author_name}')>"

def get_database_url():
    """Получает URL базы данных из переменных окружения."""
    db_name = os.getenv("DATABASE_NAME", "reviews.db")
    return f"sqlite:///{db_name}"

def create_engine_instance():
    """Создает экземпляр движка SQLAlchemy."""
    database_url = get_database_url()
    return create_engine(database_url, echo=False)

def get_session():
    """Создает и возвращает сессию базы данных."""
    engine = create_engine_instance()
    Session = sessionmaker(bind=engine)
    return Session()

def init_db():
    """Инициализирует базу данных, создавая все необходимые таблицы."""
    engine = create_engine_instance()
    Base.metadata.create_all(engine)
    print(f"База данных инициализирована: {get_database_url()}")

if __name__ == "__main__":
    # Для тестирования можно запустить этот файл напрямую
    init_db()