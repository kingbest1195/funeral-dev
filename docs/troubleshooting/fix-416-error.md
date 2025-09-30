# Устранение ошибки HTTP 416 при загрузке CSS

## Описание проблемы

При загрузке сайта периодически возникают следующие ошибки:

```
Failed to load resource: the server responded with a status of 416 ()
Uncaught Error: Unable to preload CSS for /assets/WhyTrustSection-tn0RQdqM.css
WhyTrustSection-tn0RQdqM.css:1 Failed to load resource: the server responded with a status of 416 ()
```

### Что означает ошибка 416?

**HTTP 416 (Range Not Satisfiable)** — это ошибка, которая возникает, когда браузер запрашивает часть файла (используя заголовок `Range`), но указанный диапазон байтов некорректен или выходит за пределы файла.

## Причины возникновения

Эта ошибка возникает из-за комбинации факторов:

1. **Кеширование с Range requests**
   - Браузер кеширует информацию о размере CSS файла
   - При повторном запросе использует заголовок `Range` для загрузки только нужной части

2. **Изменение хеша файла после пересборки**
   - Vite генерирует новые хеши при каждой сборке (например, `WhyTrustSection-tn0RQdqM.css`)
   - Новый файл имеет другой размер
   - Старые данные о размере в кеше становятся неактуальными

3. **Кеш CDN**
   - Yandex Cloud CDN может кешировать старые версии файлов
   - При обновлении приложения возникает несоответствие между HTML (с новыми хешами) и кешированными CSS файлами

## Реализованное решение

### 1. Файл `public/_headers`

Создан файл с правильными заголовками кеширования:

```
# Для CSS и JS с хешами - агрессивное кеширование (1 год)
# Отключаем Range requests для предотвращения ошибки 416
/assets/*.css
  Cache-Control: public, max-age=31536000, immutable
  Accept-Ranges: none

/assets/*.js
  Cache-Control: public, max-age=31536000, immutable
  Accept-Ranges: none
```

**Ключевой момент:** `Accept-Ranges: none` — отключает поддержку частичных запросов для CSS/JS файлов.

### 2. Обновление `vite.config.js`

Добавлены настройки для стабильного именования и предотвращения конфликтов:

```javascript
build: {
  // Настройки для предотвращения ошибки 416 при preload CSS
  cssCodeSplit: true, // Разделение CSS по чанкам
  assetsInlineLimit: 0, // Отключаем инлайнинг для стабильности кеширования
  rollupOptions: {
    output: {
      // Стабильные имена файлов с хешем содержимого
      assetFileNames: (assetInfo) => {
        if (/\.(css)$/i.test(assetInfo.name)) {
          return `assets/[name]-[hash][extname]`;
        }
        return `assets/[name]-[hash][extname]`;
      }
    }
  }
}
```

### 3. Скрипт инвалидации кеша CDN

Создан скрипт `scripts/invalidate-cdn-cache.sh` для очистки кеша после деплоя.

**Использование:**

```bash
# Установите ID вашего CDN ресурса
export YC_CDN_RESOURCE_ID=your-cdn-resource-id

# Запустите инвалидацию
npm run cdn:clear
```

## Инструкция по применению решения

### Шаг 1: Настройка Yandex Cloud Storage

**ВАЖНО:** Yandex Object Storage не поддерживает файл `_headers` напрямую. Заголовки нужно настроить через:

#### Вариант А: Настройка в CDN (рекомендуется)

1. Откройте консоль Yandex Cloud
2. Перейдите в Cloud CDN
3. Выберите ваш CDN-ресурс
4. В разделе "HTTP заголовки" добавьте:
   - Для `/assets/*.css` и `/assets/*.js`:
     - `Cache-Control: public, max-age=31536000, immutable`
     - `Accept-Ranges: none`
   - Для `*.html`:
     - `Cache-Control: public, max-age=0, must-revalidate`
     - `Accept-Ranges: none`

#### Вариант Б: Настройка в Object Storage

1. Откройте консоль Yandex Cloud
2. Перейдите в Object Storage
3. Выберите бакет `ritual-vek-frontend`
4. Перейдите в "Настройки" → "HTTP заголовки"
5. Добавьте правила для разных типов файлов

### Шаг 2: Пересборка проекта

```bash
# Полная пересборка с новыми настройками
npm run build
```

### Шаг 3: Деплой на Yandex Cloud

```bash
# Если используете автоматический деплой через GitHub Actions
git add .
git commit -m "fix: устранена ошибка 416 при загрузке CSS"
git push origin main

# Или ручной деплой
npm run build:yandex
# Затем загрузите содержимое dist/ в Object Storage
```

### Шаг 4: Инвалидация кеша CDN

**Критически важно после каждого деплоя!**

```bash
# Установите переменную окружения (один раз)
export YC_CDN_RESOURCE_ID=your-cdn-resource-id

# Запустите инвалидацию
npm run cdn:clear
```

**Альтернатива через веб-интерфейс:**

1. Откройте консоль Yandex Cloud
2. Перейдите в Cloud CDN → Ваш ресурс
3. Нажмите "Инвалидировать кеш"
4. Укажите путь: `/*` (для всех файлов)
5. Подтвердите

⏱️ **Время обновления:** 5-15 минут

### Шаг 5: Проверка

1. Откройте сайт в **режиме инкогнито** (Ctrl+Shift+N / Cmd+Shift+N)
2. Откройте DevTools (F12)
3. Перейдите на вкладку Network
4. Обновите страницу (F5)
5. Проверьте, что все CSS файлы загружаются со статусом **200 OK** (не 416)

## Дополнительные меры профилактики

### Автоматическая инвалидация в CI/CD

Добавьте в GitHub Actions workflow (`.github/workflows/deploy.yml`):

```yaml
- name: Invalidate CDN Cache
  run: |
    yc cdn cache purge \
      --resource-id ${{ secrets.YC_CDN_RESOURCE_ID }} \
      --path "/*"
```

### Мониторинг ошибок

Добавьте в Google Analytics или Яндекс.Метрику отслеживание ошибок загрузки ресурсов:

```javascript
window.addEventListener('error', (event) => {
  if (event.target.tagName === 'LINK' && event.target.rel === 'stylesheet') {
    // Отправка события в аналитику
    console.error('CSS load error:', event.target.href);
  }
}, true);
```

## Часто задаваемые вопросы

**Q: Почему ошибка возникает не всегда?**

A: Ошибка проявляется только когда:
- Пользователь уже посещал сайт (есть кеш)
- Произошла пересборка с изменением хеша CSS
- CDN еще не обновил кеш

**Q: Почему нельзя просто отключить кеширование?**

A: Кеширование критически важно для производительности. Без него каждый пользователь будет заново загружать все CSS/JS файлы при каждом посещении. Решение — правильная настройка кеширования, а не его отключение.

**Q: Как часто нужно инвалидировать кеш?**

A: После каждого деплоя на production. Для dev-окружения не требуется.

**Q: Что делать, если ошибка все еще возникает?**

A: 
1. Проверьте, что заголовки действительно применены (через DevTools → Network → Response Headers)
2. Убедитесь, что инвалидация кеша завершилась (может занять до 15 минут)
3. Очистите локальный кеш браузера (Ctrl+Shift+Del)
4. Проверьте в режиме инкогнито

## Дополнительные ресурсы

- [Документация Yandex Cloud CDN](https://cloud.yandex.ru/docs/cdn/)
- [HTTP заголовки кеширования](https://developer.mozilla.org/ru/docs/Web/HTTP/Headers/Cache-Control)
- [Vite: Asset Handling](https://vitejs.dev/guide/assets.html)
- [HTTP 416 Range Not Satisfiable](https://developer.mozilla.org/ru/docs/Web/HTTP/Status/416)
