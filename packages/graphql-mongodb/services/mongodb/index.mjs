
import mongoose from 'mongoose'

import * as model from '../../model/index.mjs'

import CONFIG from '../../config.mjs'

const service = {

	name: 'mongodb',

	init () {
		process.on('SIGTERM', () => {
			mongoose.disconnect()
			console.log('MongoDB disconnected')
		})

		return mongoose.connect(
			CONFIG.MongoDB.URI,
			CONFIG.MongoDB.options
		).then(mongodb => {

			return {

				connection: mongodb.connection, // for services.gridfs

				query (query) {
					console.log('* mongodb.query:', query)

					const qModel = model[query.model]
					const qMethod = qModel[query.method].bind(qModel)
					const qArgs = query.args

					return qMethod(... qArgs)
				}
			}
		})
	}

}

export default service
