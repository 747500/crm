import amqp from 'amqplib';

import CONFIG from './config.ts';
import { productionCalendar } from './services/calendar.ts';

async function main() {
  const conn = await amqp.connect(CONFIG.AMQP.url);
  const ch = await conn.createChannel();
  await ch.assertQueue(CONFIG.AMQP.queue, { durable: true });
  await ch.prefetch(1);

  console.log(
    `* external service listening on "${CONFIG.AMQP.queue}" at ${CONFIG.AMQP.url}`,
  );

  await ch.consume(CONFIG.AMQP.queue, async (msg) => {
    if (!msg) return;
    let reply: unknown;
    try {
      const req = JSON.parse(msg.content.toString());
      if (req.action === 'productionCalendar') {
        const year = req.year || new Date().getFullYear();
        reply = await productionCalendar(year);
      } else {
        reply = { error: `Unknown action: ${req.action}` };
      }
    } catch (e) {
      reply = { error: String(e) };
    }

    if (msg.properties.replyTo) {
      ch.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify(reply)),
        {
          correlationId: msg.properties.correlationId,
        },
      );
    }
    ch.ack(msg);
  });
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.kill(process.pid, 'SIGTERM');
  setTimeout(() => process.kill(process.pid, 'SIGKILL'), 3000);
});
