
module.exports = {

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
			maxAge: 60000
		}
	},

}
