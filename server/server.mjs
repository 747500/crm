import express from 'express';

import api from './routes/index.mjs';

import Services from './services/index.mjs';

Services.Run()
  .then((services) => {
    services.express.use(express.static('public'));
    services.express.use('/api/v0', api);

    // eslint-disable-next-line no-unused-vars
    services.express.use((err, req, res, next) => {
      console.error('! express error:', err);

      if (res.headersSent) {
        return next(err);
      }

      res.status(err.status || 500).json({
        error: err.name || 'Error',
        message: err.message || String(err),
      });
    });

    services.amqp.onBotAuth((message, next) => {
      // TODO to refactor to middleware?

      services.mongodb.authTelegramBot(
        message.content.toString(), // mongodb user _id
        message.properties.correlationId, // telegram user id
        next,
      );
    });
  })
  .catch((err) => {
    console.error('FATAL:', err);
    process.kill(process.pid, 'SIGTERM');
    setTimeout(() => process.kill(process.pid, 'SIGKILL'), 3000);
  });
