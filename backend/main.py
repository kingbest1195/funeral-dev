"""
Главный файл FastAPI приложения для системы сбора отзывов.
Содержит API endpoints и настройку планировщика задач.
"""
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from typing import List
import uvicorn
import atexit

from database import Review, get_session, init_db
from parsers.yandex_parser import fetch_and_save_yandex_reviews
from config.constants import API_CONFIG, SCHEDULER_CONFIG

# Планировщик задач
scheduler = BackgroundScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Управление жизненным циклом приложения."""
    # Инициализация при запуске
    init_db()

    # Запуск планировщика
    scheduler.start()

    # Добавляем задачу для ежедневного сбора отзывов
    scheduler.add_job(
        func=fetch_and_save_yandex_reviews,
        trigger=CronTrigger(
            hour=SCHEDULER_CONFIG["daily_parse_hour"],
            minute=SCHEDULER_CONFIG["daily_parse_minute"]
        ),
        id='daily_yandex_reviews',
        name='Ежедневный сбор отзывов Яндекс',
        replace_existing=True
    )

    print(f"Планировщик запущен. Ежедневный сбор отзывов настроен на {SCHEDULER_CONFIG['daily_parse_hour']:02d}:{SCHEDULER_CONFIG['daily_parse_minute']:02d}")

    yield

    # Очистка при завершении
    scheduler.shutdown()

# Создаем FastAPI приложение
app = FastAPI(
    title="Reviews API",
    description="API для управления отзывами из Яндекс и Google карт",
    version="1.0.0",
    lifespan=lifespan
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=API_CONFIG["cors_origins"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    """Dependency для получения сессии базы данных."""
    db = get_session()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    """Корневой endpoint."""
    return {"message": "Reviews API работает"}

@app.get("/health")
async def health_check():
    """Проверка состояния API."""
    return {"status": "healthy", "scheduler_running": scheduler.running}

@app.get("/api/reviews", response_model=List[dict])
async def get_reviews(
    limit: int = API_CONFIG["default_page_size"],
    offset: int = 0,
    source: str = None,
    db: Session = Depends(get_db)
):
    """
    Получить отзывы с сортировкой по длине текста и дате.

    Args:
        limit: Количество отзывов (по умолчанию 10)
        offset: Смещение для пагинации (по умолчанию 0)
        source: Фильтр по источнику ('yandex' или 'google')
        db: Сессия базы данных
    """
    try:
        query = db.query(Review)

        # Фильтр по источнику, если указан
        if source:
            query = query.filter(Review.source == source)

        # Сортировка: сначала по длине текста (по убыванию), потом по дате (по убыванию)
        query = query.order_by(
            desc(func.length(Review.review_text)),
            desc(Review.publish_date)
        )

        # Пагинация
        reviews = query.offset(offset).limit(limit).all()

        # Преобразуем в словари
        result = []
        for review in reviews:
            result.append({
                "id": review.id,
                "source": review.source,
                "source_name": review.source_name,
                "source_url": review.source_url,
                "author_name": review.author_name,
                "author_avatar_url": review.author_avatar_url,
                "review_text": review.review_text,
                "rating": review.rating,
                "publish_date": review.publish_date.isoformat() if review.publish_date else None,
                "created_at": review.created_at.isoformat() if review.created_at else None
            })

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка получения отзывов: {str(e)}")

@app.get("/api/reviews/count")
async def get_reviews_count(
    source: str = None,
    db: Session = Depends(get_db)
):
    """
    Получить общее количество отзывов.

    Args:
        source: Фильтр по источнику ('yandex' или 'google')
        db: Сессия базы данных
    """
    try:
        query = db.query(Review)

        if source:
            query = query.filter(Review.source == source)

        count = query.count()

        return {"count": count, "source": source}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка подсчета отзывов: {str(e)}")

@app.post("/api/reviews/fetch-yandex")
async def manual_fetch_yandex():
    """Ручной запуск сбора отзывов из Яндекс карт."""
    try:
        fetch_and_save_yandex_reviews()
        return {"message": "Сбор отзывов из Яндекс карт запущен"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка запуска сбора: {str(e)}")

@app.get("/api/scheduler/status")
async def get_scheduler_status():
    """Получить статус планировщика и запланированных задач."""
    jobs = []
    for job in scheduler.get_jobs():
        jobs.append({
            "id": job.id,
            "name": job.name,
            "next_run": job.next_run_time.isoformat() if job.next_run_time else None
        })

    return {
        "scheduler_running": scheduler.running,
        "jobs": jobs
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)