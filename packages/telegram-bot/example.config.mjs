// Секреты и подключения берём из окружения — см. .env.example
// (серв-скрипт загружает .env через node --env-file-if-exists=.env)
export default {
  telegram: {
    Token: process.env.TELEGRAM_TOKEN || '',
    loggerDir: process.env.TELEGRAM_LOGGER_DIR || './msglog',
    Proxy: process.env.TELEGRAM_PROXY || '',
  },

  amqp: {
    url: process.env.AMQP_URL || 'amqp://127.0.0.1',

    // Очередь входящих сообщений для пересылки пользователю (assert здесь)
    botQueue: {
      name: process.env.AMQP_BOT_QUEUE || 'crm_untyped_net_bot',
      properties: {
        exclusive: true,
        durable: true,
      },
    },

    // Очередь исходящих auth-запросов (assert на стороне BFF)
    authQueue: process.env.AMQP_AUTH_QUEUE || 'crm_bot_auth',
  },
};
