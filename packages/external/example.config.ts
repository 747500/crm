// Пример конфига; скопируйте в config.ts или задайте через .env
export default {
	AMQP: {
		url: process.env.AMQP_URL || 'amqp://127.0.0.1',
		queue: process.env.AMQP_EXTERNAL_QUEUE || 'crm-external',
	},
	Calendar: {
		baseUrl: process.env.PRODUCTION_CALENDAR_URL || 'https://www.consultant.ru/law/ref/calendar/proizvodstvennye/',
		timeoutMs: parseInt(process.env.HTTP_TIMEOUT_MS || '15000', 10),
	},
}
