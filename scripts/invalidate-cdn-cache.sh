#!/bin/bash

# Скрипт для инвалидации кеша Yandex Cloud CDN
# Используется после деплоя для обновления кешированных ресурсов

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Инвалидация кеша Yandex Cloud CDN ===${NC}"
echo ""

# Проверка наличия yc CLI
if ! command -v yc &> /dev/null; then
    echo -e "${RED}Ошибка: yc CLI не установлен${NC}"
    echo "Установите Yandex Cloud CLI: https://cloud.yandex.ru/docs/cli/quickstart"
    exit 1
fi

# Проверка переменных окружения
if [ -z "$YC_CDN_RESOURCE_ID" ]; then
    echo -e "${RED}Ошибка: переменная YC_CDN_RESOURCE_ID не установлена${NC}"
    echo "Установите ID вашего CDN ресурса:"
    echo "export YC_CDN_RESOURCE_ID=your-cdn-resource-id"
    exit 1
fi

echo -e "${YELLOW}Инвалидация кеша для всех файлов...${NC}"

# Инвалидация всего кеша (используем /* для всех путей)
yc cdn cache purge \
    --resource-id "$YC_CDN_RESOURCE_ID" \
    --path "/*"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Кеш успешно инвалидирован${NC}"
    echo -e "${YELLOW}Примечание: Обновление может занять до 15 минут${NC}"
else
    echo ""
    echo -e "${RED}✗ Ошибка при инвалидации кеша${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Совет: После инвалидации откройте сайт в режиме инкогнито${NC}"
echo -e "${YELLOW}для проверки обновлений${NC}"
