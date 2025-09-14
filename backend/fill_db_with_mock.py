"""
Заполнение базы данных mock-данными отзывов.
Используется для демонстрации работы системы.
"""
import os
import json
from datetime import datetime, timedelta
import random
from dotenv import load_dotenv
from database import Review, get_session, init_db

def fill_database_with_mock_data():
    """Заполняет базу данных mock-данными отзывов."""

    # Загружаем реальные URL из .env
    load_dotenv()
    yandex_urls = os.getenv("YANDEX_URLS", "").split(',')
    yandex_urls = [url.strip() for url in yandex_urls if url.strip()]

    if not yandex_urls:
        yandex_urls = [
            "https://yandex.ru/maps/org/vek_funeral_hall/example1",
            "https://yandex.ru/maps/org/vek/example2"
        ]

    # Инициализируем базу данных
    init_db()
    session = get_session()

    # Проверяем, есть ли уже отзывы
    existing_count = session.query(Review).count()
    if existing_count > 0:
        print(f"📊 В базе уже есть {existing_count} отзывов")
        response = input("Очистить базу и добавить новые данные? (y/n): ")
        if response.lower() == 'y':
            session.query(Review).delete()
            session.commit()
            print("🗑️ База данных очищена")
        else:
            print("❌ Операция отменена")
            session.close()
            return

    # Mock-данные отзывов
    mock_reviews_data = [
        {
            'author': 'Анна Петровна',
            'text': 'Благодарим за профессиональную организацию похорон моей мамы. Все было сделано с достоинством и вниманием к деталям. Особенно хочу отметить внимательность персонала в такой сложный для нас период.',
            'days_ago': 5,
            'rating': 5.0
        },
        {
            'author': 'Сергей М.',
            'text': 'Отличная служба. Помогли во всем, взяли на себя все организационные вопросы. Цены разумные, отношение человечное.',
            'days_ago': 12,
            'rating': 5.0
        },
        {
            'author': 'Марина Васильевна',
            'text': 'Спасибо большое за качественные услуги. В трудную минуту получили профессиональную помощь и поддержку.',
            'days_ago': 8,
            'rating': 5.0
        },
        {
            'author': 'Дмитрий',
            'text': 'Быстро, качественно, недорого. Рекомендую всем, кто столкнулся с необходимостью организации похорон. Персонал очень внимательный и тактичный.',
            'days_ago': 3,
            'rating': 5.0
        },
        {
            'author': 'Елена К.',
            'text': 'Очень довольны работой. Все сделали быстро и качественно. Спасибо за помощь в организации.',
            'days_ago': 15,
            'rating': 4.0
        },
        {
            'author': 'Александр Николаевич',
            'text': 'Обращались для организации похорон отца. Все прошло на высшем уровне. Большое спасибо за профессионализм и человечность в такой тяжелый период. Отдельное спасибо за помощь с документами.',
            'days_ago': 22,
            'rating': 5.0
        },
        {
            'author': 'Ирина',
            'text': 'Хорошая служба, разумные цены. Помогли с выбором гроба и венков.',
            'days_ago': 7,
            'rating': 4.0
        },
        {
            'author': 'Валентина Степановна',
            'text': 'Благодарю за организацию достойных похорон супруга. Все было сделано очень деликатно и профессионально. В такие моменты особенно важна поддержка и понимание.',
            'days_ago': 30,
            'rating': 5.0
        },
        {
            'author': 'Николай П.',
            'text': 'Отличный сервис, доступные цены. Рекомендую.',
            'days_ago': 18,
            'rating': 5.0
        },
        {
            'author': 'Людмила Ивановна',
            'text': 'Очень благодарна за помощь. В трудную минуту получила профессиональную поддержку. Все организовано на высоком уровне, цены справедливые.',
            'days_ago': 45,
            'rating': 4.0
        },
        {
            'author': 'Андрей С.',
            'text': 'Спасибо за качественную работу и человечное отношение.',
            'days_ago': 6,
            'rating': 5.0
        },
        {
            'author': 'Галина Михайловна',
            'text': 'Обращались для организации похорон мамы. Сотрудники проявили максимальную деликатность и профессионализм. Все вопросы решались оперативно. Большое человеческое спасибо.',
            'days_ago': 14,
            'rating': 5.0
        },
        {
            'author': 'Татьяна Владимировна',
            'text': 'Выражаю благодарность сотрудникам за тактичность и профессиональный подход. Все было организовано на высшем уровне.',
            'days_ago': 9,
            'rating': 5.0
        },
        {
            'author': 'Игорь',
            'text': 'Хорошие специалисты, помогли решить все вопросы быстро и качественно.',
            'days_ago': 25,
            'rating': 4.0
        },
        {
            'author': 'Мария Александровна',
            'text': 'Рекомендую эту службу. Деликатный подход, внимание к деталям, справедливые цены.',
            'days_ago': 11,
            'rating': 5.0
        }
    ]

    # Аватары (некоторые будут с аватарами, некоторые без)
    avatar_urls = [
        'https://avatars.yandex.net/get-yapic/123/456-789',
        'https://avatars.yandex.net/get-yapic/456/789-123',
        'https://avatars.yandex.net/get-yapic/789/123-456',
        None, None, None  # Некоторые без аватаров
    ]

    now = datetime.now()
    added_count = 0

    print("📝 Добавляю отзывы в базу данных...")

    for i, review_data in enumerate(mock_reviews_data, 1):
        publish_date = now - timedelta(days=review_data['days_ago'])
        source_url = random.choice(yandex_urls)

        new_review = Review(
            source='yandex',
            source_name='Яндекс.Бизнес',
            source_url=source_url,
            author_name=review_data['author'],
            author_avatar_url=random.choice(avatar_urls),
            review_text=review_data['text'],
            rating=review_data['rating'],
            publish_date=publish_date,
            created_at=now
        )

        session.add(new_review)
        added_count += 1

        stars = "⭐" * int(review_data['rating']) + "☆" * (5 - int(review_data['rating']))
        print(f"  {i:2d}. {review_data['author']} - {review_data['rating']} {stars}")

    # Сохраняем изменения
    session.commit()
    session.close()

    print(f"\n✅ Добавлено {added_count} отзывов в базу данных!")
    print(f"📊 Всего отзывов в БД: {added_count}")

    # Статистика
    ratings = [r['rating'] for r in mock_reviews_data]
    avg_rating = sum(ratings) / len(ratings)
    rating_counts = {}
    for rating in ratings:
        rating_counts[rating] = rating_counts.get(rating, 0) + 1

    print(f"\n⭐ СТАТИСТИКА РЕЙТИНГОВ:")
    print(f"Средний рейтинг: {avg_rating:.1f} из 5")
    for rating in sorted(rating_counts.keys(), reverse=True):
        stars = "⭐" * int(rating)
        print(f"  {rating} {stars}: {rating_counts[rating]} отзывов")

if __name__ == "__main__":
    fill_database_with_mock_data()