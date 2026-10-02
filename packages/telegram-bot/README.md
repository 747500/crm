# @crm/telegram-bot

Telegram-бот для CRM (пакет монорепозитория `crm`). Работает через RabbitMQ.

## Настройка

1. Получить токен у @BotFather.
2. Скопировать `.env.example` в `.env` и вписать токен:

   ```bash
   cp .env.example .env
   # затем: TELEGRAM_TOKEN=<ваш токен>
   ```

   `config.mjs` читает значения из окружения; `serve` подхватывает `.env`
   через `node --env-file-if-exists=.env` (секретов в коде нет).

## Требования

- RabbitMQ
- Node 22+

## Запуск

```bash
npm run serve        # из каталога пакета
npm run serve:bot    # из корня монорепозитория
```
