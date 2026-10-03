import TelegramBot from 'node-telegram-bot-api';

import CONFIG from '../config.mjs';

const service = {
  name: 'telegram',
  init() {
    return new Promise((resolve, reject) => {
      const options = {
        polling: {
          interval: 2000,
          autoStart: true,
          params: {
            timeout: 55,
          },
        },
      };

      // прокси до api.telegram.org (задаётся TELEGRAM_PROXY, см. .env.example)
      if (CONFIG.telegram.Proxy) {
        options.request = { proxy: CONFIG.telegram.Proxy };
      }

      const bot = new TelegramBot(CONFIG.telegram.Token, options);

      resolve(bot);
    });
  },
};

export default service;
