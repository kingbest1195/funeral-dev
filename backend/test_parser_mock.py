"""
Мок-версия парсера для демонстрации работы.
Имитирует получение отзывов с реальными данными.
"""
import os
import json
from datetime import datetime, timedelta
import random
from dotenv import load_dotenv

def generate_mock_reviews():
    """Генерирует мок-данные отзывов для тестирования."""

    # Загружаем реальные URL из .env
    load_dotenv()
    yandex_urls = os.getenv("YANDEX_URLS", "").split(',')

    # Очищаем URL от пробелов
    yandex_urls = [url.strip() for url in yandex_urls if url.strip()]

    if not yandex_urls:
        yandex_urls = [
            "https://yandex.ru/maps/org/vek_funeral_hall/example1",
            "https://yandex.ru/maps/org/vek/example2"
        ]

    # Реальные примеры отзывов для похоронных услуг
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
        }
    ]

    # Добавляем аватары (некоторые будут с аватарами, некоторые без)
    avatar_urls = [
        'https://avatars.yandex.net/get-yapic/123/456-789',
        'https://avatars.yandex.net/get-yapic/456/789-123',
        'https://avatars.yandex.net/get-yapic/789/123-456',
        None, None, None  # Некоторые без аватаров
    ]

    reviews = []
    now = datetime.now()

    for i, review_data in enumerate(mock_reviews_data, 1):
        publish_date = now - timedelta(days=review_data['days_ago'])
        branch_num = random.choice([1, 2])  # 2 филиала
        source_url = yandex_urls[branch_num - 1] if branch_num <= len(yandex_urls) else yandex_urls[0]

        review = {
            'branch': branch_num,
            'review_number': i,
            'source': 'yandex',
            'source_name': 'Яндекс.Бизнес',
            'source_url': source_url,
            'author_name': review_data['author'],
            'review_text': review_data['text'],
            'rating': review_data['rating'],
            'date_original': f"{review_data['days_ago']} дня назад" if review_data['days_ago'] < 7 else f"{review_data['days_ago']//7} недел назад",
            'publish_date': publish_date.strftime('%Y-%m-%d %H:%M:%S'),
            'author_avatar_url': random.choice(avatar_urls),
            'text_length': len(review_data['text'])
        }
        reviews.append(review)

    return reviews

def test_mock_parser():
    """Тестовая функция с мок-данными."""
    load_dotenv()

    print("🎭 Запуск MOCK-парсера для демонстрации...")
    print("(Используем заранее подготовленные данные вместо реального парсинга)")

    all_reviews = generate_mock_reviews()

    print(f"\n🎉 Mock-сбор завершен! Всего сгенерировано: {len(all_reviews)} отзывов")

    return all_reviews

if __name__ == '__main__':
    reviews = test_mock_parser()

    if reviews:
        print("\n" + "="*80)
        print("📋 РЕЗУЛЬТАТЫ MOCK-ПАРСИНГА:")
        print("="*80)

        # Сортируем по длине текста (убывание) → дате (убывание)
        reviews_sorted = sorted(reviews, key=lambda x: (-x['text_length'], x['publish_date']), reverse=False)

        for i, review in enumerate(reviews_sorted, 1):
            stars = "⭐" * int(review['rating']) + "☆" * (5 - int(review['rating']))
            print(f"\n--- Отзыв #{i} (филиал {review['branch']}) ---")
            print(f"Источник: {review['source_name']}")
            print(f"URL источника: {review['source_url']}")
            print(f"Автор: {review['author_name']}")
            print(f"Рейтинг: {review['rating']} {stars}")
            print(f"Дата: {review['date_original']} ({review['publish_date']})")
            print(f"Текст ({review['text_length']} символов): {review['review_text']}")
            if review['author_avatar_url']:
                print(f"Аватар: {review['author_avatar_url']}")
            print("-" * 50)

        # Сохраняем в JSON
        with open('mock_reviews.json', 'w', encoding='utf-8') as f:
            json.dump(reviews, f, ensure_ascii=False, indent=2, default=str)

        print(f"\n💾 Все отзывы сохранены в файл: mock_reviews.json")

        # Статистика
        total_chars = sum(r['text_length'] for r in reviews)
        avg_length = total_chars / len(reviews) if reviews else 0

        # Статистика рейтингов
        ratings = [r['rating'] for r in reviews]
        avg_rating = sum(ratings) / len(ratings) if ratings else 0
        rating_counts = {}
        for rating in ratings:
            rating_counts[rating] = rating_counts.get(rating, 0) + 1

        print(f"\n📊 СТАТИСТИКА:")
        print(f"Всего отзывов: {len(reviews)}")
        print(f"Филиал 1: {len([r for r in reviews if r['branch'] == 1])} отзывов")
        print(f"Филиал 2: {len([r for r in reviews if r['branch'] == 2])} отзывов")
        print(f"Средняя длина отзыва: {avg_length:.1f} символов")
        print(f"Самый длинный отзыв: {max(r['text_length'] for r in reviews)} символов")
        print(f"Самый короткий отзыв: {min(r['text_length'] for r in reviews)} символов")
        print(f"С аватарами: {len([r for r in reviews if r['author_avatar_url']])} отзывов")
        print(f"\n⭐ РЕЙТИНГИ:")
        print(f"Средний рейтинг: {avg_rating:.1f} из 5")
        for rating in sorted(rating_counts.keys(), reverse=True):
            stars = "⭐" * int(rating)
            print(f"  {rating} {stars}: {rating_counts[rating]} отзывов")

        print(f"\n✅ Данные готовы для интеграции с фронтендом!")
        print(f"📍 Формат данных соответствует API endpoint: GET /api/reviews")
    else:
        print("\n❌ Ошибка генерации mock-данных")