
import mongoose from 'mongoose'

import CONFIG from '../config.js'

const subsystem = {
	name: 'files',
	init () {
		return new Promise((resolve, reject) => {
			const connection = this.docs.connection

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

export default subsystem
