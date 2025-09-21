### **Обновленный план деплоя (Фронтенд + Бэкенд)**

Мы разделим деплой на две независимые части: фронтенд будет раздаваться как статика для максимальной скорости, а бэкенд будет жить на сервере.

**Архитектура:**

1.  **Фронтенд (React):** Размещается на **Yandex Object Storage** и раздается через **Yandex Cloud CDN**. Это самый быстрый и дешевый способ доставки статики.
2.  **Бэкенд (FastAPI):** Размещается на **VPS с Ubuntu в России**. Это обеспечит необходимую среду для запуска Python-приложения.
3.  **Домен:**
    - Основной домен `ритуал-век.рф` будет вести на фронтенд.
    - Бэкенд будет доступен по поддомену, например, `api.ритуал-век.рф`.

---

#### **Этап 1: Деплой Фронтенда (React)**

**Цель:** Развернуть React-приложение на российской инфраструктуре, обеспечив максимальную скорость, надежность и простоту обслуживания.

**Рекомендуемый стек:**

- **Хостинг файлов:** Yandex Object Storage (S3-совместимое хранилище).
- **Доставка контента:** Yandex Cloud CDN.
- **Автоматизация:** GitHub Actions (CI/CD).

---

#### **Этап 1.1: Подготовка проекта к деплою**

1.  **Сборка проекта:**

    - **Действие:** Выполнить в корне проекта команду `npm run build`.
    - **Результат:** В корне проекта появится папка `dist`, содержащая готовые для публикации статические файлы (HTML, CSS, JS, изображения). Именно эту папку мы будем деплоить.

2.  **Доступы:**

    - **Действие:** Убедись, что есть доступ к аккаунту Yandex Cloud и к панели управления доменом `ритуал-век.рф`.

---

#### **Этап 1.2: Настройка инфраструктуры в Yandex Cloud**

##### **Шаг 1.2.1: Настройка Yandex Object Storage (S3)** - DONE

Это будет наше "файловое хранилище" для сайта.

1.  **Создание бакета (Bucket):**
    - В консоли Yandex Cloud перейди в сервис "Object Storage".
    - Создай новый бакет.
      - **Имя бакета:** `ritual-vek-frontend` (имя должно быть уникальным в Yandex.Cloud).
      - **Доступ на чтение объектов:** `Публичный`.
      - **Класс хранилища:** `Standard`.
2.  **Настройка под хостинг сайта:**
    - Перейди в настройки созданного бакета, во вкладку "Хостинг".
    - Включи хостинг.
      - **Главная страница:** `index.html`.
      - **Страница ошибки:** `index.html` (важно для React Router, чтобы при обновлении страницы на вложенных роутах не было ошибки 404).
3.  **Загрузка файлов:**
    - **Действие:** Загрузи **содержимое** папки `dist` (не саму папку) в корень созданного бакета.

##### **Шаг 1.2.2: Настройка Yandex Cloud CDN**

Это ускорит доставку контента пользователям и позволит привязать домен.

1.  **Создание CDN-ресурса:** - DONE
    - В консоли Yandex Cloud перейди в сервис "Cloud CDN".
    - Создай новый ресурс.
      - **Источник контента:** `Бакет Object Storage`.
      - **Имя бакета:** Выбери созданный ранее `ritual-vek-frontend`.
      - **Доменное имя:** Укажи твой домен `ритуал-век.рф`.
2.  **Настройка HTTPS:**
    - В настройках CDN-ресурса, в разделе "HTTPS", закажи **бесплатный сертификат от Let's Encrypt** для домена `ритуал-век.рф`. Yandex Cloud автоматически выпустит и будет продлевать его.
3.  **Настройка DNS:**
    - После создания CDN-ресурса Yandex предоставит служебное доменное имя в формате `xxxx.edgecdn.ru`. Скопируй его.
    - Перейди в панель управления DNS вашего домена (`ритуал-век.рф`).
    - Создай CNAME-запись, которая будет указывать с вашего домена на служебный домен CDN.
      - **Имя:** `@` (или `ритуал-век.рф`, зависит от регистратора)
      - **Тип:** `CNAME`
      - **Значение:** `xxxx.edgecdn.ru`
    - Подожди обновления DNS-записей (от нескольких минут до нескольких часов). После этого сайт будет доступен по вашему домену.

---

#### **Этап 1.3: Настройка автоматического деплоя (CI/CD)**

**Задача:** Сделать так, чтобы при каждом пуше в `main` ветку на GitHub сайт автоматически собирался и обновлялся.

1.  **Настройка секретов в GitHub:**

    - В настройках репозитория на GitHub (`Settings -> Secrets and variables -> Actions`) создай следующие секреты:
      - `YC_KEY_ID`: ID ключа сервисного аккаунта Yandex Cloud.
      - `YC_SECRET_KEY`: Секретный ключ сервисного аккаунта.
      - `YC_BUCKET_NAME`: Имя бакета (`ritual-vek-frontend`).

2.  **Создание workflow-файла:**

    - В корне проекта создай папку `.github/workflows/`.
    - Внутри создай файл `deploy.yml` со следующим содержимым:

    <!-- end list -->

    ```yml
    name: Deploy to Yandex Cloud Storage

    on:
      push:
        branches:
          - main # Запускать при пуше в ветку main

    jobs:
      deploy:
        runs-on: ubuntu-latest

        steps:
          - name: Checkout repository
            uses: actions/checkout@v4

          - name: Set up Node.js
            uses: actions/setup-node@v4
            with:
              node-version: "20" # Укажи свою версию Node.js

          - name: Install dependencies
            run: npm ci

          - name: Build project
            run: npm run build

          - name: Yandex Cloud S3 Upload
            uses: a-mans-exp/sync-s3-bucket@v1
            with:
              aws_access_key_id: ${{ secrets.YC_KEY_ID }}
              aws_secret_access_key: ${{ secrets.YC_SECRET_KEY }}
              aws_bucket_name: ${{ secrets.YC_BUCKET_NAME }}
              local_path: "./dist"
              endpoint_url: "https://storage.yandexcloud.net" # Эндпоинт S3 Яндекса
    ```

Теперь при каждом обновлении `main` ветки GitHub Actions будет автоматически собирать проект и загружать свежую версию в Object Storage. CDN подхватит изменения.

Этот план является самым простым и оптимальным для вашего типа проекта, полностью соответствует требованиям и обеспечивает легкость в обслуживании.

---

#### **Этап 2: Деплой Бэкенда (FastAPI)**

_Вот новая, ключевая часть плана._

1.  **Аренда и подготовка VPS:**

    - Арендуйте VPS с Ubuntu 22.04 LTS в Yandex Cloud или у другого российского провайдера.
    - Подключитесь к серверу по SSH.
    - **Действия на сервере:**
      - Обновите пакеты: `sudo apt update && sudo apt upgrade -y`
      - Установите Python, pip и Nginx: `sudo apt install python3-pip python3-venv nginx -y`

2.  **Развертывание кода:**

    - **Действие:** Клонируйте ваш репозиторий на сервер: `git clone https://www.nic.ru/info/blog/repository/ /home/user/funeral-dev`
    - Перейдите в папку с бэкендом: `cd /home/user/funeral-dev/backend`
    - Создайте виртуальное окружение: `python3 -m venv venv`
    - Активируйте его: `source venv/bin/activate`
    - Установите зависимости: `pip install -r requirements.txt`

3.  **Настройка Gunicorn (WSGI-сервер):**

    - **Действие:** Установите Gunicorn: `pip install gunicorn`.
    - Gunicorn будет запускать ваше FastAPI-приложение. Команда для запуска будет выглядеть примерно так: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app`.

4.  **Настройка systemd (автозапуск и управление):**

    - **Задача:** Сделать так, чтобы ваше приложение запускалось автоматически и перезапускалось в случае сбоя.
    - **Действие:** Создайте сервисный файл `sudo nano /etc/systemd/system/funeral-backend.service` со следующим содержимым:

      ```ini
      [Unit]
      Description=Funeral Backend Service
      After=network.target

      [Service]
      User=user # Имя вашего пользователя на VPS
      Group=www-data
      WorkingDirectory=/home/user/funeral-dev/backend
      ExecStart=/home/user/funeral-dev/backend/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app

      [Install]
      WantedBy=multi-user.target
      ```

    - **Действие:** Запустите и включите автозагрузку сервиса:
      - `sudo systemctl start funeral-backend`
      - `sudo systemctl enable funeral-backend`

5.  **Настройка Nginx (Reverse Proxy):**

    - **Задача:** Настроить Nginx, чтобы он принимал запросы на поддомен `api.ритуал-век.рф` и перенаправлял их на ваше работающее приложение.
    - **Действие:** Создайте конфигурационный файл `sudo nano /etc/nginx/sites-available/funeral` со следующим содержимым:

      ```nginx
      server {
          listen 80;
          server_name api.ритуал-век.рф;

          location / {
              proxy_pass http://127.0.0.1:8000;
              proxy_set_header Host $host;
              proxy_set_header X-Real-IP $remote_addr;
          }
      }
      ```

    - **Действие:** Активируйте конфигурацию и перезапустите Nginx:
      - `sudo ln -s /etc/nginx/sites-available/funeral /etc/nginx/sites-enabled`
      - `sudo systemctl restart nginx`

6.  **Настройка DNS для поддомена:**

    - В панели управления доменом создайте A-запись для поддомена `api`, указывающую на IP-адрес вашего VPS.

7.  **Настройка HTTPS для API:**

    - **Действие:** На VPS установите Certbot и получите бесплатный SSL-сертификат для поддомена `api.ритуал-век.рф`:
      - `sudo apt install certbot python3-certbot-nginx -y`
      - `sudo certbot --nginx -d api.ритуал-век.рф`

---

#### **Этап 3: Связь Фронтенда и Бэкенда**

1.  **Настройка CORS в FastAPI:**

    - В вашем `backend/main.py` необходимо разрешить фронтенду обращаться к API.

      ```python
      from fastapi.middleware.cors import CORSMiddleware

      # ... ваш код app = FastAPI()

      origins = [
          "http://ритуал-век.рф",
          "https://ритуал-век.рф",
      ]

      app.add_middleware(
          CORSMiddleware,
          allow_origins=origins,
          allow_credentials=True,
          allow_methods=["*"],
          allow_headers=["*"],
      )
      ```

2.  **Настройка запросов во фронтенде:**
    - В React-приложении все запросы к API должны идти на `https://api.ритуал-век.рф`. Это лучше всего вынести в переменную окружения.

#### **Этап 4: Автоматизация (CI/CD)**

Ваш `deploy.yml` в GitHub Actions нужно будет разделить на две `job` (задачи):

1.  **`deploy-frontend`:** Остается практически без изменений, загружает папку `dist` в Yandex Object Storage.
2.  **`deploy-backend`:** Новая задача, которая будет:
    - Подключаться к вашему VPS по SSH.
    - Переходить в папку с проектом.
    - Выполнять `git pull`.
    - Устанавливать зависимости `pip install -r requirements.txt`.
    - Перезапускать сервис `sudo systemctl restart funeral-backend`.

Этот план надежен, безопасен и использует лучшие практики для разделения фронтенда и бэкенда, что значительно упростит дальнейшее обслуживание и масштабирование.
