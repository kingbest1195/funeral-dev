# План обновления зависимостей проекта funeral-dev

**Дата создания:** Сентябрь 2025
**Статус:** ГОТОВ К ВЫПОЛНЕНИЮ
**Приоритет:** ВЫСОКИЙ - React 19 официально стабилен (декабрь 2024)

## Анализ актуальных версий

### ✅ ОСНОВНЫЕ ЗАВИСИМОСТИ (dependencies)

| Пакет | Текущая версия | Новая версия | Статус |
|-------|----------------|--------------|---------|
| `react` | 18.3.1 | **19.1.1** | 🔴 **MAJOR UPDATE** |
| `react-dom` | 18.3.1 | **19.1.1** | 🔴 **MAJOR UPDATE** |
| `@vitejs/plugin-react` | 5.0.2 | 5.0.2 | ✅ Актуальная |
| `vite` | 7.1.5 | 7.1.5 | ✅ Актуальная |
| `sass` | 1.92.1 | 1.92.1 | ✅ Актуальная |
| `swiper` | 11.2.10 | 11.2.10 | ✅ Актуальная |
| `react-helmet-async` | 2.0.5 | 2.0.5 | ✅ Актуальная |
| `autoprefixer` | 10.4.21 | 10.4.21 | ✅ Актуальная |
| `postcss` | 8.5.6 | 8.5.6 | ✅ Актуальная |
| `postcss-preset-env` | 9.0.0 | 9.0.0 | ✅ Актуальная |
| `imask` | 7.6.1 | 7.6.1 | ✅ Актуальная |
| `minista` | 3.1.12 | 3.1.12 | ✅ Актуальная |
| `normalize.css` | 8.0.1 | 8.0.1 | ✅ Актуальная |

### ⚠️ DEV ЗАВИСИМОСТИ (devDependencies)

| Пакет | Текущая версия | Новая версия | Статус |
|-------|----------------|--------------|---------|
| `@squoosh/lib` | 0.3.1 | **0.5.3** | 🟡 Minor update |
| `playwright` | 1.55.0 | 1.55.0 | ✅ Актуальная |
| `sharp` | 0.34.3 | 0.34.3 | ✅ Актуальная |
| `glob` | 11.0.3 | 11.0.3 | ✅ Актуальная |
| Остальные | - | - | ✅ Актуальные |

## 🚨 КРИТИЧЕСКИЙ АНАЛИЗ: React 19 Migration

### Проблемные места в коде проекта

#### 1. **PropTypes Usage** 🔴 BREAKING CHANGE
**Файлы:**
- `src/components/InfoSection/InfoSection.jsx`
- `src/components/BenefitBlock/BenefitBlock.jsx`
- `src/components/CallBlock/CallBlock.jsx`

**Проблема:** React 19 удаляет поддержку PropTypes для functional components

**Решение для JavaScript проектов:**
```javascript
// ❌ СТАРЫЙ КОД (React 18)
import PropTypes from "prop-types";

const InfoSection = ({ className, title, heading, text, rightContent, originalLayout = true }) => {
  // component logic
};

InfoSection.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  heading: PropTypes.string,
  text: PropTypes.string,
  rightContent: PropTypes.node.isRequired,
  originalLayout: PropTypes.bool,
};

// ✅ НОВЫЙ КОД (React 19) - JavaScript с JSDoc
/**
 * Переиспользуемый компонент двухколоночной информационной секции
 * @param {Object} props - Параметры компонента
 * @param {string} [props.className=""] - CSS класс для стилизации
 * @param {string} [props.title] - Заголовок секции
 * @param {string} [props.heading] - Подзаголовок секции
 * @param {string} [props.text] - Текст описания
 * @param {React.ReactNode} props.rightContent - Контент правой колонки (обязательный)
 * @param {boolean} [props.originalLayout=true] - Использовать оригинальную разметку
 * @returns {JSX.Element} React компонент
 */
const InfoSection = ({
  className = "",
  title,
  heading,
  text,
  rightContent,
  originalLayout = true
}) => {
  // component logic
};

export default InfoSection;
```

**Дополнительные примеры JSDoc для остальных компонентов:**

```javascript
// BenefitBlock.jsx
/**
 * Компонент блока с информацией о пособии
 * @param {Object} props - Параметры компонента
 * @param {string} props.amount - Сумма пособия (обязательный)
 * @param {string} [props.label] - Подпись к сумме
 * @param {string} [props.icon] - Иконка компонента
 * @param {string} [props.ariaLabel] - ARIA метка для доступности
 * @param {string} [props.parentClass] - CSS класс родительского элемента
 */

// CallBlock.jsx
/**
 * Компонент блока с информацией для звонка
 * @param {Object} props - Параметры компонента
 * @param {string} props.phone - Номер телефона (обязательный)
 * @param {string} [props.note] - Дополнительная заметка
 * @param {string} [props.icon] - Иконка компонента
 * @param {string} [props.ariaLabel] - ARIA метка для доступности
 * @param {string} [props.parentClass] - CSS класс родительского элемента
 */
```

**Преимущества JSDoc подхода:**
- ✅ Нет зависимости от внешних библиотек
- ✅ Совместимо с React 19
- ✅ Поддерживается IDE (автодополнение, проверка типов)
- ✅ Можно настроить ESLint для проверки JSDoc
- ✅ Документация видна в редакторе при наведении

#### 2. **useRef Usage** ✅ СОВМЕСТИМО
**Файлы:**
- `src/components/Input/Input.jsx` (строки 44-45)
- `src/components/Global/Global.jsx` (строка 26)
- `src/components/PopupNotification/PopupNotification.jsx` (строка 54)

**Статус:** ✅ Текущий код совместим с React 19
```javascript
// ✅ Корректное использование (работает в React 19)
const inputRef = useRef(null);
const maskRef = useRef(null);
const headerRef = React.useRef(null);
```

#### 3. **ReactDOM.createRoot** ✅ УЖЕ ИСПОЛЬЗУЕТСЯ
**Файл:** `src/main.jsx`
```javascript
// ✅ Уже использует современный API React 18+
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 📋 ПОЭТАПНЫЙ ПЛАН ОБНОВЛЕНИЯ

### Этап 1: Подготовка (30 мин)
```bash
# 1. Создать ветку для обновления
git checkout -b upgrade/react-19-deps

# 2. Создать бэкап package.json
cp package.json package.json.backup

# 3. Проверить текущие тесты
npm run lint:js
npm run lint:scss
```

### Этап 2: Обновление зависимостей (10 мин)
```bash
# Обновить React и ReactDOM до 19.1.1
npm install react@19.1.1 react-dom@19.1.1

# Обновить @squoosh/lib (опционально)
npm install --save-dev @squoosh/lib@0.5.3

# Проверить совместимость
npm run dev
```

### Этап 3: Рефакторинг компонентов (60-90 мин)

#### 3.1 Рефакторинг PropTypes в JavaScript проектах
```bash
# Удалить PropTypes (больше не поддерживается в React 19)
npm uninstall prop-types

# Заменить PropTypes на JSDoc комментарии для документации типов
# Никаких дополнительных пакетов не требуется
```

#### 3.2 Файлы для рефакторинга:
1. `src/components/InfoSection/InfoSection.jsx`
2. `src/components/BenefitBlock/BenefitBlock.jsx`
3. `src/components/CallBlock/CallBlock.jsx`

#### 3.3 Автоматическая миграция (если нужна):
```bash
# Запустить codemods для React 19
npx codemod@latest react/19/migration-recipe
```

### Этап 4: Тестирование (30 мин)
```bash
# 1. Проверить сборку
npm run build

# 2. Проверить dev режим
npm run dev

# 3. Проверить основные функции:
# - Загрузка страницы
# - Работа квиза
# - Swiper карусель
# - Form validation
# - PopupNotification
# - React Helmet мета-теги

# 4. Проверить линтеры
npm run lint:js
npm run lint:scss
```

### Этап 5: Финализация (15 мин)
```bash
# 1. Коммит изменений
git add .
git commit -m "feat: upgrade React to v19.1.1

🔄 Upgraded dependencies:
- react: 18.3.1 → 19.1.1
- react-dom: 18.3.1 → 19.1.1
- @squoosh/lib: 0.3.1 → 0.5.3

🚀 Breaking changes handled:
- Removed PropTypes from functional components
- Updated component interfaces for better type safety
- Verified useRef and createRoot compatibility

🧪 Tested:
- Dev build ✓
- Production build ✓
- All core features ✓

🤖 Generated with Claude Code(https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 2. Создать PR
git push origin upgrade/react-19-deps
```

## ⚠️ ПОТЕНЦИАЛЬНЫЕ РИСКИ И РЕШЕНИЯ

### Высокий риск:
1. **PropTypes removal** - требует рефакторинга
   - *Решение:* Заменить на JSDoc комментарии для документации
   - *Время:* 45-60 минут

### Средний риск:
2. **@squoosh/lib API changes** - возможны изменения API
   - *Решение:* Проверить image optimization pipeline
   - *Время:* 15-30 минут

### Низкий риск:
3. **React Helmet compatibility** - потенциальные проблемы
   - *Решение:* Проверить работу мета-тегов
   - *Время:* 5-10 минут

4. **IMask compatibility** - возможные проблемы с ref
   - *Решение:* Протестировать Input компонент
   - *Время:* 5-10 минут

## 🎯 EXPECTED BENEFITS

### Производительность:
- **Улучшенная производительность рендеринга** (React 19)
- **Новые оптимизации компилятора** (React Compiler support)
- **Лучшая обработка форм** (новые хуки useActionState, useFormStatus)

### Developer Experience:
- **Современный стек технологий**
- **Лучшая поддержка в IDE**
- **Актуальная документация и community support**

### Безопасность:
- **Последние security patches**
- **Актуальные зависимости без уязвимостей**

## 📊 TIMELINE SUMMARY

| Этап | Время | Сложность |
|------|-------|-----------|
| Подготовка | 30 мин | 🟢 Низкая |
| Обновление пакетов | 10 мин | 🟢 Низкая |
| Рефакторинг PropTypes→JSDoc | 45-60 мин | 🟡 Средняя |
| Тестирование | 30 мин | 🟢 Низкая |
| Финализация | 15 мин | 🟢 Низкая |
| **ИТОГО** | **2-2.5 часа** | 🟡 **Средняя** |

## ✅ КРИТЕРИИ УСПЕХА

1. ✅ Проект успешно собирается (`npm run build`)
2. ✅ Dev режим работает без ошибок (`npm run dev`)
3. ✅ Все линтеры проходят без ошибок
4. ✅ Основной функционал работает:
   - Квиз-калькулятор
   - Swiper карусели
   - Формы с валидацией
   - PopupNotification
   - React Helmet мета-теги
5. ✅ Performance метрики не ухудшились
6. ✅ Console.log без React warnings

## 🚀 РЕКОМЕНДАЦИЯ

**СТАТУС: РЕКОМЕНДУЕТСЯ К ВЫПОЛНЕНИЮ**

React 19 официально стабилен с декабря 2024. Проект использует современные паттерны и требует минимальных изменений. Основная работа — удаление PropTypes и опциональная конвертация в TypeScript.

**Приоритет обновления: ВЫСОКИЙ**
- Безопасность: ✅
- Производительность: ⬆️ Улучшение
- Сложность миграции: 🟡 Средняя (только JSDoc рефакторинг)
- ROI: 🟢 Высокий

---

## 🛠️ БЫСТРЫЙ СТАРТ ДЛЯ JAVASCRIPT ПРОЕКТОВ

### Команды для обновления:
```bash
# 1. Создать ветку
git checkout -b upgrade/react-19-deps

# 2. Обновить React
npm install react@19.1.1 react-dom@19.1.1

# 3. Удалить PropTypes
npm uninstall prop-types

# 4. Проверить сборку
npm run dev
```

### Чек-лист рефакторинга PropTypes → JSDoc:
- [ ] `src/components/InfoSection/InfoSection.jsx`
- [ ] `src/components/BenefitBlock/BenefitBlock.jsx`
- [ ] `src/components/CallBlock/CallBlock.jsx`

### Шаблон для замены:
```javascript
// Удалить это:
import PropTypes from "prop-types";
Component.propTypes = { ... };

// Добавить это:
/**
 * @param {Object} props - Параметры компонента
 * @param {string} props.requiredProp - Обязательный параметр
 * @param {string} [props.optionalProp] - Опциональный параметр
 */
```

**Время выполнения: 2-2.5 часа**