
module.exports = {

	AMQP: {
		url: 'amqp://127.0.0.1',

		// Queue to receive auth requests from bot users
		authQueue: {
			name: 'crm_bot_auth',
			properties: {
				durable: true,
			},
		},
		// Queue to send message to Telegram users,
		// created by crm-telegram-bot
		botQueue: 'crm_bot_messages',
	},

	SphinxQL: {
		address: '127.0.0.1',
		port: '9306',
		indexName: 'testrt',
	},

	MongoDB: {
		URI: 'mongodb://127.0.0.1:27017/crm',
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true
		},
	},

	Express: {
		port: 3000,
		Session: {
			secret: '!!! CHANGE ME !!!',
			maxAge: 60 * 1000
		}
	},

}
