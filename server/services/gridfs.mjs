
import mongoose from 'mongoose'

import CONFIG from '../config.js'

const service = {

	name: 'gridfs',

	init () {
		return new Promise((resolve, reject) => {
			const connection = this.mongodb.connection

			const collection = connection.collection('fs.files')
			const bucket = new mongoose.mongo.GridFSBucket(connection.db)

			const ok = collection.createIndex('metadata.docId')
				.then(() => {
					return { collection, bucket }
				})
				.catch(reject)

			resolve(ok)
		})
	},
}

export default service
