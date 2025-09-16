# Шаблон компонента

Этот шаблон предоставляет базовую структуру для создания новых компонентов в проекте ритуальной службы "Век".

## 🎯 Назначение

Шаблон включает все необходимые элементы для создания качественного, доступного и производительного компонента:

- ✅ **Современная React архитектура** с хуками
- ✅ **JSDoc документация** для всех props
- ✅ **Accessibility support** с ARIA атрибутами
- ✅ **BEM методология** в SCSS
- ✅ **CSS Custom Properties** без хардкода
- ✅ **Адаптивный дизайн** mobile-first
- ✅ **Поддержка состояний** loading, disabled, active
- ✅ **Keyboard navigation** поддержка
- ✅ **Reduced motion** поддержка

## 📋 Использование шаблона

### 1. Копирование файлов
```bash
# Создать новую папку компонента
mkdir src/components/YourComponentName

# Скопировать шаблонные файлы
cp docs/templates/component-template/ComponentTemplate.jsx src/components/YourComponentName/YourComponentName.jsx
cp docs/templates/component-template/ComponentTemplate.scss src/components/YourComponentName/YourComponentName.scss
```

### 2. Замена названий
Замените все вхождения `ComponentTemplate` на имя вашего компонента:

```bash
# В JSX файле
sed -i 's/ComponentTemplate/YourComponentName/g' src/components/YourComponentName/YourComponentName.jsx
sed -i 's/component-template/your-component-name/g' src/components/YourComponentName/YourComponentName.jsx

# В SCSS файле
sed -i 's/component-template/your-component-name/g' src/components/YourComponentName/YourComponentName.scss
```

### 3. Настройка импортов
Обновите импорты в JSX файле согласно вашим потребностям:

```javascript
// Добавьте нужные константы
import { YOUR_MODULE_DATA } from "@/constants/content";

// Добавьте изображения
import imageWebp from "@/assets/images-optimized/your-image.webp";
import imageJpg from "@/assets/images/your-image.jpg";
```

## 🎨 Настройка стилей

### Основные модификаторы
Шаблон включает стандартные модификаторы:

- `--primary` - основной стиль с акцентными цветами
- `--secondary` - вторичный стиль
- `--featured` - выделенный стиль для важных элементов
- `--card` - карточный стиль с центрированием

### Состояния
- `--active` - активное состояние
- `--loading` - состояние загрузки
- `--disabled` - отключенное состояние

### Адаптивность
Стили следуют mobile-first подходу с брейкпоинтами:
- `md-down` - до 768px (планшеты и мобильные)
- `sm-down` - до 640px (мобильные)

## 🔧 Настройка функциональности

### Props API
Основные props включены в шаблон:

```javascript
<YourComponent
  title="Заголовок"
  description="Описание"
  variant="primary"
  onAction={() => {}}
  actionText="Кнопка"
  disabled={false}
  loading={false}
  className="custom-class"
/>
```

### State управление
Шаблон включает базовые состояния:

```javascript
const [isActive, setIsActive] = useState(false);
const [internalLoading, setInternalLoading] = useState(false);
```

Добавьте дополнительные состояния по необходимости.

### Event handlers
Базовые обработчики:

```javascript
const handleAction = async () => {
  // Ваша логика
};

const handleKeyPress = (event) => {
  // Keyboard navigation
};
```

## ♿ Accessibility

Шаблон включает необходимые ARIA атрибуты:

```jsx
<section
  role="region"
  aria-label={ariaLabel || title}
  aria-busy={internalLoading}
>
  <button
    aria-label={`${actionText} для ${title}`}
    aria-busy={internalLoading}
  >
```

## 📱 Адаптивность

Mobile-first подход в CSS:

```scss
.your-component {
  // Базовые стили для мобильных
  padding: var(--spacing-sm);

  @include md-up {
    // Планшеты и десктоп
    padding: var(--spacing-lg);
  }
}
```

## 🎯 Примеры специализации

### Карточка услуги
```javascript
const ServiceCard = ({ service }) => (
  <YourComponent
    title={service.title}
    description={service.description}
    variant="card"
    onAction={() => window.open(service.link)}
    actionText="Подробнее"
  />
);
```

### Секция страницы
```javascript
const PageSection = ({ sectionData }) => (
  <YourComponent
    title={sectionData.title}
    variant="featured"
    className="page-section"
  >
    {sectionData.content}
  </YourComponent>
);
```

## ✅ Чек-лист настройки

- [ ] Файлы скопированы и переименованы
- [ ] Все `ComponentTemplate` заменены на ваше название
- [ ] CSS классы обновлены (`component-template` → `your-component`)
- [ ] Импорты настроены под ваши нужды
- [ ] JSDoc документация обновлена
- [ ] Props API адаптирован
- [ ] Стили настроены под дизайн
- [ ] Accessibility атрибуты проверены
- [ ] Keyboard navigation протестирована
- [ ] Адаптивность проверена

## 🚀 Интеграция

После настройки компонента:

1. **Импортируйте** в родительский компонент
2. **Добавьте** в константы контента (если нужно)
3. **Протестируйте** функциональность
4. **Проверьте** линтинг: `npm run lint:js` и `npm run lint:scss`
5. **Обновите** документацию

---

**Помните**: Этот шаблон — отправная точка. Адаптируйте его под конкретные требования вашего компонента, следуя принципам проекта.