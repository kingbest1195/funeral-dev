# Настройка кэширования для Yandex Cloud S3 + CDN

Этот файл содержит инструкции по настройке эффективного кэширования для сайта, размещённого в Yandex Cloud Object Storage и доставляемого через Yandex CDN.

## 📁 Конфигурационные файлы

- `.s3-cache-headers.json` - Правила кэширования для S3 бакета
- `.yandex-cdn-headers.conf` - Конфигурация заголовков для CDN

## 🔧 Настройка S3 бакета

### 1. Применение правил кэширования через CLI

```bash
# Установка CLI Yandex Cloud
curl https://storage.yandexcloud.net/yandexcloud-yc/install.sh | bash

# Применение правил кэширования
yc storage bucket update \
  --name your-bucket-name \
  --lifecycle-rules file://.s3-cache-headers.json
```

### 2. Настройка через веб-интерфейс

1. Перейдите в [Yandex Cloud Console](https://console.cloud.yandex.ru/)
2. Выберите сервис **Object Storage**
3. Откройте настройки вашего бакета
4. В разделе **Lifecycle** загрузите содержимое `.s3-cache-headers.json`

## 🌐 Настройка CDN

### 1. Создание CDN ресурса

```bash
# Создание CDN ресурса
yc cdn resource create \
  --cname your-domain.com \
  --origin-group-id YOUR_ORIGIN_GROUP_ID \
  --origin-protocol https \
  --secondary-hostnames www.your-domain.com
```

### 2. Настройка заголовков кэширования

В настройках CDN ресурса добавьте правила из `.yandex-cdn-headers.conf`:

```nginx
# Применить в разделе "HTTP заголовки" CDN ресурса
add_header Cache-Control "public, max-age=31536000, immutable" always;
add_header Vary "Accept-Encoding" always;
```

## 📊 Оптимальные значения кэширования

| Тип ресурса | Cache-Control | Срок | Комментарий |
|-------------|---------------|------|-------------|
| HTML файлы | `max-age=300` | 5 мин | Быстрое обновление контента |
| Хэшированные ресурсы | `max-age=31536000, immutable` | 1 год | Неизменяемые файлы |
| Изображения | `max-age=2592000` | 30 дней | Средний срок для картинок |
| Шрифты | `max-age=31536000` | 1 год | Редко изменяются |
| JS/CSS | `max-age=86400` | 1 день | Регулярные обновления |

## 🚀 Проверка настроек

### Проверка заголовков кэширования

```bash
# Проверка заголовков для различных типов файлов
curl -I https://your-domain.com/
curl -I https://your-domain.com/assets/index-hash.js
curl -I https://your-domain.com/assets/image.webp
curl -I https://your-domain.com/assets/font.woff2
```

### Ожидаемые заголовки

```http
# HTML
Cache-Control: public, max-age=300, s-maxage=300
X-Content-Type-Options: nosniff
X-Frame-Options: DENY

# Статические ресурсы с хэшем
Cache-Control: public, max-age=31536000, s-maxage=31536000, immutable
Vary: Accept-Encoding

# Шрифты
Cache-Control: public, max-age=31536000, s-maxage=31536000, immutable
Access-Control-Allow-Origin: *
```

## 📈 Ожидаемые результаты

После применения настроек ожидается:

- **Уменьшение времени загрузки** на 30-50%
- **Снижение нагрузки на CDN** на 60-80%
- **Улучшение PageSpeed Insights** на 10-20 баллов
- **Экономия трафика** до 70%

## 🔄 Инвалидация кэша

При обновлении сайта:

```bash
# Очистка кэша CDN
yc cdn cache purge \
  --resource-id YOUR_CDN_RESOURCE_ID \
  --path "/*"

# Очистка кэша определённых файлов
yc cdn cache purge \
  --resource-id YOUR_CDN_RESOURCE_ID \
  --path "/assets/*.js" \
  --path "/assets/*.css"
```

## 🛠️ Автоматизация

Добавьте в CI/CD pipeline:

```yaml
# .github/workflows/deploy.yml (пример)
- name: Deploy to Yandex Cloud
  run: |
    # Загрузка файлов в S3
    aws s3 sync dist/ s3://your-bucket --delete

    # Очистка CDN кэша
    yc cdn cache purge --resource-id $CDN_RESOURCE_ID --path "/*"
```

## ⚠️ Важные моменты

1. **Тестирование**: Обязательно протестируйте настройки на staging среде
2. **Мониторинг**: Следите за метриками после внедрения
3. **Инвалидация**: Настройте автоматическую очистку кэша при деплое
4. **CORS**: Убедитесь в правильной настройке CORS для шрифтов
5. **Gzip**: Включите сжатие на уровне CDN для текстовых файлов