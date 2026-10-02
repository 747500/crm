
// Значения берутся из окружения (.env), см. .env.example
export default {

	RabbitMQ: {

		url: process.env.AMQP_URL || 'amqp://127.0.0.1',

		queues: {
			update: { name: 'crm-update', properties: { durable: true, exclusive: false } },
			query: { name: 'crm-query', properties: { durable: true, exclusive: false } },
			graphql: {
				name: process.env.AMQP_GRAPHQL_QUEUE || 'crm-graphql',
				properties: { durable: true, exclusive: false },
			},
		}
	},

	MongoDB: {
		URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crm',
		options: { useNewUrlParser: true, useUnifiedTopology: true },
	},
}
