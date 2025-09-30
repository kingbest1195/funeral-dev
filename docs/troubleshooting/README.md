# Устранение проблем (Troubleshooting)

Этот раздел содержит руководства по устранению распространенных проблем.

## 📋 Список проблем и решений

### [Ошибка HTTP 416 при загрузке CSS](./fix-416-error.md)

**Симптомы:**
```
Failed to load resource: the server responded with a status of 416 ()
Uncaught Error: Unable to preload CSS
```

**Причина:** Конфликт кеширования между CDN и браузером после пересборки проекта.

**Быстрое решение:**
```bash
# Инвалидация кеша CDN
npm run cdn:clear
```

**Подробности:** [fix-416-error.md](./fix-416-error.md)

---

## 🔧 Быстрые команды

### Очистка кеша и пересборка

```bash
# Полная пересборка
npm run build

# Деплой с подготовкой для Yandex Cloud
npm run build:yandex

# Очистка кеша CDN
npm run cdn:clear
```

### Локальная отладка

```bash
# Запуск dev-сервера
npm run dev

# Preview production сборки
npm run preview
```

### Проверка кода

```bash
# Линтинг SCSS
npm run lint:scss

# Линтинг JavaScript
npm run lint:js
```

## 🆘 Если ничего не помогает

1. **Проверьте логи Yandex Cloud**
   - Object Storage → Бакет → Логи
   - CDN → Ресурс → Статистика

2. **Проверьте заголовки ответов**
   - Откройте DevTools (F12)
   - Network → Выберите файл → Headers
   - Проверьте `Cache-Control` и `Accept-Ranges`

3. **Полная очистка**
   ```bash
   # Очистка node_modules и пересборка
   rm -rf node_modules dist
   npm install
   npm run build
   ```

4. **Проверка в изолированной среде**
   - Откройте сайт в режиме инкогнито
   - Используйте другой браузер
   - Проверьте с мобильного устройства

## 📚 Дополнительные ресурсы

- [Deployment Guide](../deploy/deploy-plan.md) - Полный план деплоя
- [Development Guide](../development/architecture-guide.md) - Архитектура проекта
- [Code Standards](../standards/code-standards.md) - Стандарты кода

## 📞 Контакты для поддержки

Если проблема не решается:
1. Создайте issue в GitHub репозитории
2. Приложите:
   - Скриншот ошибки из консоли браузера
   - Шаги для воспроизведения
   - Информацию о браузере и ОС
