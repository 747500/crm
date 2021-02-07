'use strict'

import querystring from 'querystring'

import moment from 'moment'

import mongoose from 'mongoose'
mongoose.Promise = global.Promise
import models from './db_schema.mjs'

mongoose.connect(
	'mongodb://127.0.0.1:27017/crm',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
)
.then(result => {

	console.log('DB connected')

	const db = result.connection

	const handle = db.collection('fs.files')
		.findOne(
			{
			'metadata.docId': { $exists: false }
			},
			{
				_id: true
			}
		)
		.then(file => {

			if (null === file) {
				result.disconnect()
				return { text: 'Not found' }
			}

			return db.collection('docs')
				.findOne(
					{
						files: {
							$elemMatch: { $eq: file._id}
						}
					}
				)
				.then(doc => {
					return db.collection('fs.files')
						.findOneAndUpdate(
							{
							_id: file._id
							},
							{
								$set: {
									'metadata.docId': doc._id
								}
							}
						)
						.then(result => {
							console.log(file, doc, result);
						})


				})

		})

	return handle
})
.then(console.log)
.catch(console.error)
