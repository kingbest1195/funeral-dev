# Настройка кэширования для Yandex Cloud S3 + CDN

Этот файл содержит инструкции по настройке эффективного кэширования для сайта, размещённого в Yandex Cloud Object Storage и доставляемого через Yandex CDN.

## 🔧 Настройка S3 бакета (Lifecycle правила)

### Настройка через веб-интерфейс Object Storage

1. Перейдите в [Yandex Cloud Console](https://console.cloud.yandex.ru/)
2. Выберите сервис **Object Storage** → **Buckets**
3. Откройте ваш бакет `ritual-vek-frontend`
4. Перейдите в раздел **Settings** → **Lifecycle**
5. Создайте следующие правила:

#### Правило 1: Автоматическое удаление временных файлов
- **Status**: Enabled
- **Description**: "Удаление временных файлов через 1 день"
- **Prefix**: `temp/`
- **Type**: Expiration
- **Days**: 1

#### Правило 2: Переход в холодное хранилище для архивов
- **Status**: Enabled
- **Description**: "Архивирование старых файлов"
- **Prefix**: `archive/`
- **Type**: Transition
- **Storage Class**: Cold Storage
- **Days**: 30

### Альтернатива через CLI

```bash
# Установка CLI Yandex Cloud
curl https://storage.yandexcloud.net/yandexcloud-yc/install.sh | bash

# Применение правил кэширования
yc storage bucket update \
  --name ritual-vek-frontend \
  --lifecycle-rules file://.s3-cache-headers.json
```

## 🌐 Настройка Cloud CDN

### Настройка кэширования в веб-интерфейсе

1. Перейдите в **Cloud CDN** → **CDN resources**
2. Откройте ваш CDN ресурс `ритуал-век.рф`
3. Перейдите в раздел **Caching** → **Edit**

#### Основные настройки кэширования:

**CDN caching**:
- ✅ **Enabled**
- **Settings**: Custom settings
- **Default cache lifetime**: 4 days
- **Cache lifetime for response codes**:
  - HTTP response: 4xx → a few seconds
  - Add custom codes по необходимости

**Browser caching**:
- ✅ **Enabled**
- **Default cache lifetime**: 4 days

**Additional settings**:
- **Cookie**: ☐ Ignore (для статического контента)
- **Query parameters**: ☐ Ignore (для статического контента)

### Оптимальные настройки по типам контента

#### Для HTML файлов:
- **CDN cache**: 5 минут (300 секунд)
- **Browser cache**: 5 минут (300 секунд)

#### Для статических ресурсов (JS/CSS с хэшем):
- **CDN cache**: 1 год (365 дней)
- **Browser cache**: 1 год (365 дней)

#### Для изображений:
- **CDN cache**: 30 дней
- **Browser cache**: 30 дней

#### Для шрифтов:
- **CDN cache**: 1 год (365 дней)
- **Browser cache**: 1 год (365 дней)

### Создание CDN ресурса через CLI

```bash
# Создание CDN ресурса
yc cdn resource create \
  --cname ритуал-век.рф \
  --origin-group-id YOUR_ORIGIN_GROUP_ID \
  --origin-protocol https \
  --secondary-hostnames www.ритуал-век.рф
```

## 📊 Рекомендуемые настройки кэширования

### Таблица оптимальных значений

| Тип ресурса | CDN Cache | Browser Cache | Комментарий |
|-------------|-----------|---------------|-------------|
| HTML файлы | 5 минут | 5 минут | Быстрое обновление контента |
| JS/CSS с хэшем | 1 год | 1 год | Неизменяемые файлы |
| Изображения | 30 дней | 30 дней | Средний срок для картинок |
| Шрифты | 1 год | 1 год | Редко изменяются |
| API ответы | Отключен | Отключен | Динамический контент |

### Настройка HTTP заголовков в CDN

В разделе **HTTP headers and methods** добавьте:

```nginx
# Для статических ресурсов
add_header Cache-Control "public, max-age=31536000, immutable" always;
add_header Vary "Accept-Encoding" always;

# Для HTML файлов
add_header Cache-Control "public, max-age=300" always;

# Безопасность
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
```

## 🚀 Проверка настроек

### Проверка заголовков кэширования

```bash
# Проверка заголовков для различных типов файлов
curl -I https://ритуал-век.рф/
curl -I https://ритуал-век.рф/assets/index-hash.js
curl -I https://ритуал-век.рф/assets/image.webp
curl -I https://ритуал-век.рф/assets/font.woff2
```

### Ожидаемые заголовки ответа

```http
# HTML страницы
Cache-Control: public, max-age=300
X-Content-Type-Options: nosniff
X-Frame-Options: DENY

# Статические ресурсы (JS/CSS/шрифты)
Cache-Control: public, max-age=31536000, immutable
Vary: Accept-Encoding

# Изображения
Cache-Control: public, max-age=2592000
Vary: Accept-Encoding
```

## 📈 Ожидаемые результаты оптимизации

После применения настроек кэширования:

- **🚀 Ускорение загрузки**: 30-50% для повторных посещений
- **📉 Снижение нагрузки на сервер**: 60-80% меньше запросов
- **📊 PageSpeed Insights**: +10-20 баллов к общей оценке
- **💰 Экономия трафика**: до 70% снижение исходящего трафика
- **⚡ Улучшение UX**: мгновенная загрузка статических ресурсов

## 🔄 Управление кэшем

### Инвалидация через веб-интерфейс

1. Перейдите в **Cloud CDN** → **CDN resources**
2. Выберите ваш ресурс `ритуал-век.рф`
3. В разделе **Content** нажмите **Purge cache**
4. Укажите пути для очистки:
   - `/*` - очистить весь кэш
   - `/assets/*` - очистить только статические ресурсы
   - `/index.html` - очистить главную страницу

### Инвалидация через CLI

```bash
# Установка CLI и аутентификация
yc init

# Полная очистка кэша
yc cdn cache purge \
  --resource-id YOUR_CDN_RESOURCE_ID \
  --path "/*"

# Очистка определённых файлов
yc cdn cache purge \
  --resource-id YOUR_CDN_RESOURCE_ID \
  --path "/assets/*.js" \
  --path "/assets/*.css" \
  --path "/index.html"
```

## 🛠️ Автоматизация деплоя

### GitHub Actions для автоматического деплоя

```yaml
# .github/workflows/deploy.yml
name: Deploy to Yandex Cloud
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Deploy to S3
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.YC_ACCESS_KEY }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.YC_SECRET_KEY }}
        run: |
          aws s3 sync dist/ s3://ritual-vek-frontend --delete \
            --endpoint-url=https://storage.yandexcloud.net

      - name: Purge CDN cache
        env:
          YC_TOKEN: ${{ secrets.YC_TOKEN }}
        run: |
          yc cdn cache purge \
            --resource-id ${{ secrets.CDN_RESOURCE_ID }} \
            --path "/*"
```

## ⚠️ Важные рекомендации

### Безопасность и производительность

1. **🧪 Тестирование**: Обязательно протестируйте настройки на staging
2. **📊 Мониторинг**: Отслеживайте метрики после внедрения
3. **🔄 Инвалидация**: Настройте автоочистку кэша при деплое
4. **🔐 CORS**: Правильно настройте CORS для шрифтов и API
5. **📦 Gzip**: Включите сжатие на уровне CDN
6. **🛡️ Security headers**: Добавьте заголовки безопасности

### Мониторинг эффективности

- **Yandex.Metrica**: Отслеживайте скорость загрузки страниц
- **PageSpeed Insights**: Проверяйте регулярно после изменений
- **CDN статистика**: Анализируйте hit rate в Cloud CDN
- **Core Web Vitals**: Мониторьте LCP, FID, CLS метрики