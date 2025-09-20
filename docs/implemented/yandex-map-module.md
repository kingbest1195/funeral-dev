# Модуль интерактивной Яндекс.Карты для секции "Свяжитесь с нами"

## 📋 Техническое задание

### Цель модуля
Создать интерактивную карту Яндекс с отметками 3 филиалов ритуальной службы "Век" в г. Шуя для замены текущего placeholder в секции ContactsMapSection.

### Функциональные требования

#### 1. Отображение филиалов на карте
- **3 офиса** с точными координатами из Яндекс.Карт
- **Кастомные маркеры** с логотипом/иконкой компании
- **Автоматическое позиционирование** карты для показа всех офисов
- **Интерактивные popup** при клике на маркер

#### 2. Popup-карточки офисов
Каждая карточка должна содержать:
- **Название офиса** (например, "Главный офис", "Ритуальный зал")
- **Полный адрес**
- **График работы**
- **Фотография офиса** (если доступна)
- **Кнопка "Позвонить"** → `tel:+79203663636`
- **Кнопка "Построить маршрут"** → внешняя ссылка на Яндекс.Карты

#### 3. Управление картой
Минимальный набор контролов:
- **Зум** (приближение/отдаление)
- **Переключатель типов карты** (схема/спутник)
- **Полноэкранный режим** (опционально)

## 🏗️ Техническая архитектура

### Структура файлов
```
src/
├── components/
│   └── YandexMap/
│       ├── YandexMap.jsx          # Основной компонент
│       ├── YandexMap.scss         # Стили BEM
│       └── index.js               # Экспорт
└── constants/
    └── content.js                 # Расширение CONTACTS_MAP_DATA
```

### Координаты филиалов
Извлечены из переданных URL:

1. **Главный офис**
   - Адрес: `г. Шуя, Ул. Красноармейский переулок, 6`
   - Координаты: `[41.376142, 56.846580]`
   - URL: `https://yandex.ru/maps/org/vek/22307782205/`

2. **Ритуальный зал**
   - Адрес: `г. Шуя, Ул. Фабричная, 27`
   - Координаты: `[41.344564, 56.836470]`
   - URL: `https://yandex.ru/maps/org/vek_funeral_hall/82211087167/`

3. **Дополнительный офис**
   - Адрес: `г. Шуя, Ул. Генерала Белова, 33`
   - Координаты: `[41.378828, 56.847504]`
   - URL: `https://yandex.ru/maps/org/vek/199633794817/`

### Центр карты
- **Координаты**: `[41.360, 56.841]` (геометрический центр между офисами)
- **Зум**: `13-14` (оптимальный для показа всех точек)

## 💻 Детали реализации

### 1. Подключение Яндекс.Карт API
```javascript
// Загрузка через CDN с ленивой инициализацией
const YANDEX_MAPS_API = 'https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=ru_RU';

// Проверка доступности API
if (typeof ymaps !== 'undefined') {
  ymaps.ready(initMap);
}
```

### 2. Инициализация карты
```javascript
const myMap = new ymaps.Map('yandex-map-container', {
  center: [41.360, 56.841],
  zoom: 13,
  controls: ['zoomControl', 'typeSelector']
});
```

### 3. Создание маркеров
```javascript
const offices = [
  {
    id: 1,
    coordinates: [41.376142, 56.846580],
    title: 'Главный офис',
    address: 'г. Шуя, Ул. Красноармейский переулок, 6',
    note: '(2 минуты от ЦРБ)',
    schedule: 'Пн-Вс, с 8:00 до 17:00',
    phone: '+7 (920) 366-36-36',
    routeUrl: 'https://yandex.ru/maps/org/vek/22307782205/'
  }
  // ... остальные офисы
];

offices.forEach(office => {
  const placemark = new ymaps.Placemark(office.coordinates, {
    balloonContentHeader: office.title,
    balloonContentBody: createBalloonContent(office)
  }, {
    preset: 'islands#icon',
    iconColor: '#c49e5e' // Акцентный цвет из variables.scss
  });

  myMap.geoObjects.add(placemark);
});
```

### 4. HTML-контент popup
```javascript
function createBalloonContent(office) {
  return `
    <div class="office-balloon">
      <h4 class="office-balloon__title">${office.title}</h4>
      <p class="office-balloon__address">${office.address}</p>
      ${office.note ? `<p class="office-balloon__note">${office.note}</p>` : ''}
      <p class="office-balloon__schedule">${office.schedule}</p>
      <div class="office-balloon__actions">
        <a href="tel:${office.phone.replace(/\D/g, '')}"
           class="btn btn--primary btn--sm">
          Позвонить
        </a>
        <a href="${office.routeUrl}"
           target="_blank"
           rel="noopener noreferrer"
           class="btn btn--secondary btn--sm">
          Маршрут
        </a>
      </div>
    </div>
  `;
}
```

## 🎨 Стилизация

### BEM-структура классов
```scss
.yandex-map {
  // Контейнер карты
  &__container {
    // Размеры и позиционирование
  }

  &__loader {
    // Индикатор загрузки
  }

  &__error {
    // Сообщение об ошибке
  }
}

.office-balloon {
  // Стили для popup-карточек
  &__title {
    // Заголовок офиса
  }

  &__address {
    // Адрес
  }

  &__note {
    // Дополнительная информация
  }

  &__schedule {
    // График работы
  }

  &__actions {
    // Контейнер кнопок
  }
}
```

### Использование CSS-переменных
```scss
.yandex-map {
  height: var(--map-height, 400px);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);

  @media (max-width: 768px) {
    height: var(--map-height-mobile, 300px);
  }
}

.office-balloon {
  &__title {
    color: var(--color-text-primary);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
  }

  &__actions {
    display: flex;
    gap: var(--spacing-3);
    margin-top: var(--spacing-4);
  }
}
```

## 📱 Адаптивность

### Мобильные устройства (< 768px)
- **Высота карты**: 300px вместо 400px
- **Упрощенные контролы**: только зум
- **Touch-friendly**: жесты масштабирования и перетаскивания
- **Адаптивные popup**: компактная версия карточек

### Планшеты (768px - 1024px)
- **Стандартная высота**: 400px
- **Полный набор контролов**
- **Оптимизированные размеры кнопок**

### Десктоп (> 1024px)
- **Увеличенная высота**: 450px
- **Дополнительные контролы**: полноэкранный режим
- **Расширенные popup**: с фотографиями офисов

## ⚡ Производительность

### Ленивая загрузка
```javascript
// Загрузка API только при скролле к карте
const mapObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadYandexMapsAPI();
      mapObserver.unobserve(entry.target);
    }
  });
});

mapObserver.observe(document.querySelector('.yandex-map'));
```

### Fallback на случай недоступности API
```javascript
function createMapFallback() {
  return (
    <div className="yandex-map__fallback">
      <h3>Наши адреса:</h3>
      {offices.map(office => (
        <div key={office.id} className="office-fallback">
          <h4>{office.title}</h4>
          <p>{office.address}</p>
          <a href={office.routeUrl} target="_blank" rel="noopener noreferrer">
            Показать на карте
          </a>
        </div>
      ))}
    </div>
  );
}
```

## 🔗 Интеграция с ContactsMapSection

### Замена placeholder
```jsx
// Было:
<div className="map-container">
  <div className="map-placeholder">
    <p>{CONTACTS_MAP_DATA.mapPlaceholder}</p>
  </div>
</div>

// Станет:
<div className="map-container">
  <YandexMap offices={CONTACTS_MAP_DATA.offices} />
</div>
```

### Обновление CONTACTS_MAP_DATA
```javascript
export const CONTACTS_MAP_DATA = {
  // ... существующие поля
  offices: {
    title: "Адреса офисов",
    items: [
      {
        id: 1,
        title: "Главный офис",
        address: "г. Шуя, Ул. Красноармейский переулок, 6",
        coordinates: [41.376142, 56.846580],
        note: "(2 минуты от ЦРБ)",
        schedule: "График работы: Пн-Вс, с 8:00 до 17:00",
        mapUrl: "https://yandex.ru/maps/org/vek/22307782205/",
        ariaLabel: "Построить маршрут: Красноармейский пер., 6",
        photo: "/images/offices/main-office.jpg" // опционально
      },
      // ... остальные офисы
    ]
  }
};
```

## ♿ Accessibility

### ARIA-атрибуты
```jsx
<div
  id="yandex-map-container"
  role="application"
  aria-label="Интерактивная карта с адресами офисов ритуальной службы Век"
  tabIndex="0"
>
```

### Keyboard navigation
- **Tab**: фокус между маркерами
- **Enter/Space**: открытие popup
- **Escape**: закрытие popup
- **Arrow keys**: навигация по карте

### Screen reader support
```jsx
<div className="sr-only">
  Интерактивная карта показывает расположение 3 офисов
  ритуальной службы Век в городе Шуя. Используйте клавишу Tab
  для навигации между офисами.
</div>
```

## 🧪 Тестирование

### Проверки перед релизом
- [ ] **Все маркеры отображаются** корректно
- [ ] **Popup открываются** при клике на маркеры
- [ ] **Кнопки "Позвонить"** ведут на `tel:+79203663636`
- [ ] **Кнопки "Маршрут"** открывают Яндекс.Карты в новой вкладке
- [ ] **Адаптивность** работает на всех разрешениях
- [ ] **Ленивая загрузка** активируется при скролле
- [ ] **Fallback** отображается при недоступности API
- [ ] **Accessibility** - навигация с клавиатуры работает

### Кросс-браузерная совместимость
- ✅ **Chrome** (основной браузер)
- ✅ **Safari** (Mac/iOS)
- ✅ **Firefox**
- ✅ **Edge**
- ⚠️ **IE11** (деградация до fallback)

## 📊 Метрики производительности

### Цели загрузки
- **API загрузка**: < 2 сек
- **Инициализация карты**: < 1 сек
- **Отрисовка маркеров**: < 500мс
- **Размер bundle**: +50КБ max

### Мониторинг
```javascript
// Трекинг загрузки API
console.time('YandexMaps API Load');
loadYandexMapsAPI().then(() => {
  console.timeEnd('YandexMaps API Load');
});

// Трекинг инициализации
console.time('Map Initialization');
ymaps.ready(() => {
  initMap();
  console.timeEnd('Map Initialization');
});
```

---

## 🚀 План внедрения

1. **Фаза 1**: Создание базового компонента с маркерами
2. **Фаза 2**: Добавление интерактивных popup
3. **Фаза 3**: Стилизация и адаптивность
4. **Фаза 4**: Оптимизация производительности
5. **Фаза 5**: Тестирование и багфиксы

**Ожидаемое время разработки**: 1-2 дня
**Приоритет**: Высокий (улучшает UX контактной секции)