
// Значения берутся из окружения (.env), см. .env.example
module.exports = {

	AMQP: {
		url: process.env.AMQP_URL || 'amqp://127.0.0.1',
		replyTimeoutMs: parseInt(process.env.AMQP_REPLY_TIMEOUT_MS || '15000', 10),

		// Очередь приёма auth-запросов от бота
		authQueue: {
			name: process.env.AMQP_AUTH_QUEUE || 'crm_bot_auth',
			properties: {
				durable: true,
			},
		},

		// Очередь сообщений Telegram-пользователям
		botQueue: process.env.AMQP_BOT_QUEUE || 'crm_untyped_net_bot',

		queues: {
			graphql: {
				name: process.env.AMQP_GRAPHQL_QUEUE || 'crm-graphql',
			},
		},
	},

	SphinxQL: {
		address: process.env.SPHINX_HOST || '127.0.0.1',
		port: process.env.SPHINX_PORT || '9306',
		indexName: process.env.SPHINX_INDEX || 'testrt',
	},

	MongoDB: {
		URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crm',
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
	},

	Express: {
		port: parseInt(process.env.PORT || '3000', 10),
		Session: {
			secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
			maxAge: parseInt(process.env.SESSION_MAX_AGE || '2592000000', 10),
		},
	},

}
