'use strict'

import querystring from 'querystring'

import moment from 'moment'

import express from 'express'
import morgan from 'morgan'
//import bodyParser from 'body-parser'

import mongoose from 'mongoose'

mongoose.Promise = global.Promise

const app = express()
const port = 3000
app.use(morgan('dev'))
app.use(express.json())

// --------------------------------------------------------------------------

const docSchemaOptions = {
	discriminatorKey: 'kind'
}

const docSchema = new mongoose.Schema(
	{
		time: Date
	},
	docSchemaOptions
);

const Doc = mongoose.model('Doc', docSchema)

const Person = Doc.discriminator(
	'person',
	new mongoose.Schema(
		{
			firstName: String,
			lastName: String,
			middleName: String,
			birthDay: Date,
			passport: String,
			files: [ mongoose.Types.ObjectId ]
		},
		docSchemaOptions
	)
)

const Property = Doc.discriminator(
	'property',
	new mongoose.Schema(
		{
			address: String,
			description: String,
			files: [ mongoose.Types.ObjectId ]
		},
		docSchemaOptions
	)
)

// --------------------------------------------------------------------------

mongoose.connect(
	'mongodb://127.0.0.1:27017/crm',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
).then((result)=> {
	const db = result.connection
	var bucket = new mongoose.mongo.GridFSBucket(result.connection.db)

	console.log('DB connected')

	const docAsResult = (req, res, next) => {
		var doc = res.locals.Doc

//		if ('function' typeof person)
		res.locals.Result = doc.toObject()
		next()
	}

	const sendResultJSON = (req, res) => {
		res.send(res.locals.Result)
	}

	// TODO validation
	const docList = (req, res, next) => {

		res.locals.Schema.find().then(
			result => {
				res.locals.Result = result
				next()
			}
		).catch(next)

	}

	// TODO validation
	const docEvents = (req, res, next) => {

		console.log(req.query)

		const month = parseInt(moment(req.query.yearmonth).format('MM'))

		res.locals.Doc.aggregate([
			{
				$project: {
					firstName: 1,
					middleName: 1,
					lastName: 1,
					birthDay: 1,
					month: {
						$month: '$birthDay'
					}
				}
			},
			{
				$match: {
					month: month
				}
			}
		]).then(
			result => {
				res.locals.Result = result.map(i => {

					const birthDate = moment(i.birthDay).format('DD-MM-YYYY')
					const day = moment(i.birthDay).format('DD')
					const eventDate = `${req.query.yearmonth}-${day}`
					const age = 1 + moment(eventDate).diff(i.birthDay, 'years');

					return {
						eventAt: eventDate,
						eventTitle: `${birthDate} ${i.lastName} ${i.firstName} ${i.middleName} ${age}`
					}
				})
				next()
			}
		).catch(next)
	}


	// TODO validation
	const schemaResolve = (req, res, next) => {

		const sel = {
			'person': Person,
			'property': Property
		}

		const sName = req.params.schema
		res.locals.Schema = sel[sName]

		next()
	}


	// TODO validation
	const docLoad = (req, res, next) => {

		console.log('>>>', res.locals.Schema);

		res.locals.Schema
			.findById(req.params.id)
			.then(
				result => {
					console.log('* docLoad:', result.toObject())
					res.locals.Doc = result
					next()
				}
			).catch(next)

	}

	// TODO validation
	const docFindByIdAndUpdate = (req, res, next) => {

		delete req.body.files

		res.locals.Doc
			.findByIdAndUpdate(
				req.body._id,
				{
					$set: req.body
				}
			).then(
				result => {
					console.log('* findByIdAndUpdate:', result.toObject())
					Doc = result
					next()
				}
			).catch(next)

	}

	const docNew = (req, res, next) => {

		delete req.body._id

		try {
			res.locals.Doc = new res.locals.Schema(req.body)
		}
		catch (err) {
			next(err)
		}

		next()
	}

	const docSave = (req, res, next) => {

		const doc = res.locals.Doc

		doc.save().then(
			() => next(),
			err => next(err)
		)

		console.log('* docSave', doc.toObject())

	}

	const docUploadFile = (req, res, next) => {

		const doc = res.locals.Doc
		const filename = req.params.filename
		const mimetype = req.headers['content-type']

		var stream = bucket.openUploadStream(
			filename,
			{
				contentType: mimetype,
				metadata: {
					lastModified: new Date(req.headers['last-modified'])
				}
			}
		);

		stream.once('finish', () => {
			res.locals.Result = {
				file_id: stream.id
			}
			next()
		})

		stream.once('error', next)

		doc.files.push(stream.id)

		console.log('* after docUploadFile:', doc);

		req.pipe(stream)

	}

	const getFile = (req, res, next) => {

		const oid = mongoose.Types.ObjectId(req.params.id)

		db.collection('fs.files').findOne({ _id: oid }).then(fileinfo => {

			if (null === fileinfo) { // 404
				next()
				return;
			}

			const hasLastModified =
					'object' === typeof fileinfo.metadata &&
					fileinfo.metadata.lastModified instanceof Date

			const lastModified =
					hasLastModified ?
					fileinfo.metadata.lastModified :
					fileinfo.uploadDate

			const contentDisposition =
					'inline;' + // or 'attachment' for downloads
					'filename=' +
					querystring.escape(fileinfo.filename)

			res.set({
				'Content-Length': fileinfo.length,
				'Content-Type': fileinfo.contentType,
				'Last-Modified': lastModified.toISOString(),
				'Content-Disposition': contentDisposition,
				'ETag': 'W/' + oid.toString()
			})

			const stream = bucket.openDownloadStream(oid)

			stream.once('error', next)

			stream.pipe(res)

		}).catch(next)
	}

// --------------------------------------------------------------------------

	app.get('/f/:id',
		getFile
	)

	app.get('/:schema/list',
		schemaResolve,
		docList,
		sendResultJSON
	)

	app.get('/person/events',
		schemaResolve,
		docEvents,
		sendResultJSON
	)

	app.get('/:schema/:id',
		schemaResolve,
		docLoad,
		docAsResult,
		sendResultJSON
	)

	app.post('/:schema',
		schemaResolve,
		docFindByIdAndUpdate,
		docAsResult,
		sendResultJSON
	)

	app.put('/:schema',
		schemaResolve,
		docNew,
		docSave,
		docAsResult,
		sendResultJSON
	)

	app.post('/:schema/:id/upload/:filename',
		schemaResolve,
		docLoad,
		docUploadFile,
		docSave,
		sendResultJSON
	)


	app.use(express.static('public'))

	app.listen(port, () => {
	  console.log(`Example app listening at http://localhost:${port}`)
	})

// --------------------------------------------------------------------------


}).catch(err => {
	console.error(err)
})
