
module.exports = {

	AMQP: {
		url: 'amqp://127.0.0.1',

		// to receive auth requests
		// queue to reply to comes from message.preferences.replyTo
		authQueue: {
			name: 'crm_bot_auth',
			properties: {
				durable: true,
			},
		}
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
