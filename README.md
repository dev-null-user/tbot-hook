# Webhook to Telegram Bot

Сервис для обработки входящих вебхуков и отправки уведомлений в Telegram-каналы. Поддерживает интеграцию с Planka и другими источниками, маршрутизирует сообщения в соответствующие Telegram-чаты.

## Особенности

- Обработка входящих вебхуков от различных источников
- Интеграция с Planka (управление задачами и уведомления)
- Маршрутизация сообщений по темам в разные Telegram-чаты
- Поддержка топиков (thread) в Telegram
- Валидация входящих данных
- Гибкая настройка через переменные окружения
- Обработка ошибок и логирование

## Требования

- Node.js (версия 14.0.0 или выше)
- npm (версия 6.0.0 или выше)
- Telegram Bot Token (получить у [@BotFather](https://t.me/botfather))
- Доступ к Planka API (для интеграции с Planka)

## Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd tbot-hook
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` и настройте переменные окружения:
```env
# Основные настройки
PORT=3000
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Настройки маршрутизации Telegram
TELEGRAM_PATH_topic1=chat_id_1
TELEGRAM_PATH_topic2=chat_id_2:message_thread_id

# Настройки Planka
PLANKA_API_URL=https://your-planka-instance/api
PLANKA_EMAIL=your_email
PLANKA_PASSWORD=your_password
PLANKA_ADMIN_USERNAME=admin_username

```

## Запуск

Разработка:
```bash
npm run dev
```

Продакшен:
```bash
npm start
```

Отладка:
```bash
npm run debug
```

## API Endpoints

### Общие вебхуки

#### POST /webhook/:topic
Базовый вебхук для отправки сообщений в Telegram.

```bash
curl -X POST http://localhost:3000/webhook/topic1 \
     -H "Content-Type: application/json" \
     -d '{"message": "Тестовое сообщение"}'
```

### Planka интеграция

#### POST /planka/webhook
Внешний вебхук для получения уведомлений от Planka.

```bash
curl -X POST http://localhost:3000/planka/webhook \
     -H "Content-Type: application/json" \
     -d '{
       "event": "cardUpdate|cardCreate|cardDelete",
       "data": { ... }
     }'
```


## Примеры использования

1. Отправка тестового вебхука:
```bash
curl -X POST http://localhost:3000/webhook/topic1 \
     -H "Content-Type: application/json" \
     -d '{"message": "Тестовое сообщение"}'
```

2. Настройка нового маршрута:
   - Добавьте новую переменную в `.env`:
     ```env
     TELEGRAM_PATH_new_topic=chat_id_3
     ```
   - Отправьте вебхук на новый маршрут:
     ```bash
     curl -X POST http://localhost:3000/webhook/new_topic \
          -H "Content-Type: application/json" \
          -d '{"message": "Сообщение для новой темы"}'
     ```

## Разработка

### Добавление новой темы

1. Добавьте новую переменную окружения в формате:
```env
TELEGRAM_PATH_your_topic=your_chat_id
```

2. Перезапустите сервер

### Валидация

Сервис автоматически проверяет:
- Наличие обязательных полей
- Корректность типов данных
- Существование указанной темы
- Наличие настроек для темы

## Логирование

Все ошибки логируются в консоль. В продакшене рекомендуется настроить внешнее логирование.

## Безопасность

- Храните `TELEGRAM_BOT_TOKEN` в безопасном месте
- Используйте HTTPS в продакшене
- Рассмотрите возможность добавления аутентификации для вебхуков

## Лицензия

MIT

## Поддержка

При возникновении проблем создайте issue в репозитории проекта.

## Интеграция с Planka

[Planka](https://github.com/plankanban/planka/) - это open-source канбан-доска для рабочих групп, построенная на React и Redux.

### Настройка интеграции

1. Настройте переменные окружения в `.env`:
```env
# Planka API настройки
PLANKA_API_URL=https://your-planka-instance/api
PLANKA_EMAIL=your_email
PLANKA_PASSWORD=your_password
PLANKA_ADMIN_USERNAME=admin_username
INTERNAL_API_KEY=your_secure_api_key
```

### API Endpoints

#### 1. Авторизация
```bash
# Получение токена доступа
curl -X POST 'https://your-planka-instance/api/access-tokens' \
     -H 'Content-Type: application/json' \
     -d '{
         "emailOrUsername": "your_email",
         "password": "your_password",
         "withHttpOnlyToken": true
     }'
```

#### 2. Работа с досками
```bash
# Получение информации о доске
curl -X GET 'https://your-planka-instance/api/boards/{boardId}' \
     -H 'Authorization: Bearer your_token' \
     -H 'Content-Type: application/json'
```

#### 3. Работа с карточками
```bash
# Перемещение карточки в другой список
curl -X PATCH 'https://your-planka-instance/api/cards/{cardId}' \
     -H 'Authorization: Bearer your_token' \
     -H 'Content-Type: application/json' \
     -d '{
         "listId": "target_list_id",
         "position": 1
     }'
```

### Webhook эндпоинты

#### 1. Внешний вебхук (получение событий от Planka)
```bash
curl -X POST 'http://your-server:3000/planka/webhook' \
     -H 'Content-Type: application/json' \
     -d '{
         "event": "cardUpdate",
         "data": {
             "item": {
                 "id": "card_id",
                 "name": "Card Name",
                 "listId": "list_id"
             },
             "included": {
                 "lists": [
                     {
                         "id": "list_id",
                         "name": "List Name"
                     }
                 ]
             }
         },
         "user": {
             "name": "User Name",
             "username": "username"
         }
     }'
```

### Поддерживаемые события

- `cardUpdate` - обновление карточки
- `cardCreate` - создание карточки
- `cardDelete` - удаление карточки
- `cardMove` - перемещение карточки между списками

### Формат сообщений в Telegram

При получении события от Planka, сервис отправляет форматированное сообщение в Telegram:

