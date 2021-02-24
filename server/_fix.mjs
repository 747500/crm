'use strict'

import querystring from 'querystring'

import moment from 'moment'
import ascyn from 'async'

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

	function doTheJob (item, cb) {

		models.Doc.findById(item._id)
		.then(doc => {
			console.log('fts>', doc.fts)
			cb()

		})
		.catch(console.error)

		/*
		db.collection('docs')

		.updateOne(
			{
			_id: item._id
			},
			{
				$set: {
					files: true
				}
			}
		)
		*/
		/*
		.replaceOne(
			{
			_id: item._id
			},
			{
				_id: item._id,
				kind: item.kind,
				person: {
					firstName: item.firstName,
					middleName: item.middleName,
					lastName: item.lastName,
					birthDay: item.birthDay,
					contact: item.contact,
				},
				mainPicture: item.mainPicture,
				ctime: item.ctime,
				mtime: new Date(),
				__v: item.__v + 1
			}
		)
		*/
		/*
		.replaceOne(
			{
			_id: item._id
			},
			{
				_id: item._id,
				ctime: item.ctime,
				mtime: new Date(),
				__v: item.__v + 1,
				kind: item.kind,
				property: {
					address: item.address,
					price: item.price,
					description: item.description,
				},
				owner: item.ownerId,
				mainPicture: item.mainPicture,
			}
		)
		*/

		/*
		.replaceOne(
			{
			_id: item._id
			},
			{
				_id: item._id,
				ctime: item.ctime,
				mtime: new Date(),
				__v: item.__v + 1,
				kind: item.kind,
				contract: {
					title: item.title,
					description: item.description,
				},
				property: item.property,
				person: item.person,
			}
		)
		*/

		/*
		.then(result => {
			console.log(result)
			cb()
		})
		.catch(err => cb(err))
		*/

		//setTimeout(cb, 1000)
	}


	return new Promise((resolve, reject) => {

		db.collection('docs')
		.find(
			{
				//kind: 'contract',
				//contract: {
				//	$exists: false
				//}
			},
			(err, cursor) => {

				function processItem (err, item) {
					if (null === item) {
						resolve('done.')
						return;
					}

					process.nextTick(() => {
						doTheJob(item, err => {
							cursor.next(processItem)
						})
					})
				}

				cursor.next(processItem)
			}
		)

	})


/*
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
*/

	return handle
})
.then(result => {
	console.log(result)
	mongoose.connection.close()
})
.catch(console.error)
