'use strict'

import querystring from 'querystring'

import moment from 'moment'

import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'


import mongoose from 'mongoose'
mongoose.Promise = global.Promise
import models from './db_schema.mjs'

import SphinxClient from 'sphinxapi'

const app = express()
const port = 3000
app.use(morgan('dev'))
app.use(bodyParser.text())
app.use(express.json())
app.use(bodyParser.json())

// ==========================================================================

const SubSystems = [

	// --------------------------------------------------------------------------

	{
		name: 'docs',
		init () {
			return mongoose.connect(
					'mongodb://127.0.0.1:27017/crm',
					{
						useNewUrlParser: true,
						useUnifiedTopology: true
					}
				)
		}

	},

	// ----------------------------------------------------------------------

	{
		name: 'files',
		init () {
			return new Promise((resolve, reject) => {
					const connection = this.docs.connection

					const collection = connection.collection('fs.files')
					const bucket = new mongoose.mongo.GridFSBucket(connection.db)

					const ok = collection.ensureIndex('metadata.docId')
						.then(() => {
							return { collection, bucket }
						})

					resolve(ok)
				})
		}
	},

	// ----------------------------------------------------------------------

	{
		name: 'sphinx',
		init () {
			return new Promise((resolve, reject) => {

					var cl = new SphinxClient()

					cl.SetServer('127.0.0.1', 9312)

					cl.Status((err, result) => {
						if (err) {
							reject(err)
							return
						}
						resolve(cl)
					})
				})
		}
	}

	// ----------------------------------------------------------------------

]

// --------------------------------------------------------------------------

function runService (service) {

	console.log('sss start:', service.name);

	return service.init.bind(this)().then(
		result => {
			console.log(`sss "${service.name}" init ok`);
			service.endpoint = result
			return result
		}
	)
}

function sssInit () {
	const sss = {}

	return SubSystems.reduce(
		(ok, s) => ok.then(() => {
			return runService.bind(sss)(s).then(() => {
				sss[s.name] = s.endpoint
			})
		}),
		Promise.resolve()
	)
	.then(result => {
		console.log('sss init ok:', Object.keys(sss))
		return sss;
	})
}

sssInit().then(sss => {

// ==========================================================================

	const search = (req, res, next) => {

		console.log('<search>', req.body)

		const searchString = req.body.q

		models.Person
		.find({
			$text: {
				$search: searchString,
				$language: 'ru'
			}
		})
    	//.skip(20)
		.limit(10)
		.exec(function(err, result) {
			if (err) {
				next(err)
				return
			}

			console.log('<search> result', result)

			res.send(result)

		});

	}

// --------------------------------------------------------------------------

	const docAsResult = (req, res, next) => {
		var doc = res.locals.Doc

		res.locals.Result = doc.toObject()

		delete res.locals.Result.__v

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

		res.locals.Schema.aggregate([
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
	const docLoad = (req, res, next) => {

		models.Doc
			.findById(req.params.id)
			.then(
				result => {
					console.log('* docLoad:\n', result.toObject())
					res.locals.Doc = result
					next()
				}
			)
			.catch(next)

	}

	// TODO validation
	const docUpdate = (req, res, next) => {

		const skip = {
			'_id': true,
			'__v': true,
			'kind': true,
			'time': true,
			'id': true
		}

		Object.keys(res.locals.Doc.schema.tree).forEach(k => {

			if (skip[k]) {
				return
			}

			res.locals.Doc[k] = req.body[k]
		})

		console.log(res.locals.Doc)

		next()
	}

	const schemaResolve = (req, res, next) => {

		const sName = req.params.schema || req.body.kind

		const sel = {
			'person': models.Person,
			'property': models.Property,
			'contract': models.Contract
		}

		res.locals.Schema = sel[sName]
		if (! res.locals.Schema ) {
			next(Error(`Undefined Schema: ${sName}`))
			return
		}

		next()
	}

	const docNew = (req, res, next) => {

		try {
			res.locals.Doc = new res.locals.Schema()
		}
		catch (err) {
			next(err)
			return
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

	const fileUpload = (req, res, next) => {

		const doc = res.locals.Doc
		const filename = req.params.filename
		const mimetype = req.headers['content-type']
		const caption = req.headers['x-meta-caption']

		var stream = sss.files.bucket.openUploadStream(
			filename,
			{
				contentType: mimetype,
				metadata: {
					docId: mongoose.Types.ObjectId(doc.id),
					lastModified: new Date(req.headers['last-modified']),
					caption: querystring.unescape(caption)
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

//		console.log('* after docUploadFile:', doc);

		req.pipe(stream)

	}

	const getFile = (req, res, next) => {

		const oid = mongoose.Types.ObjectId(req.params.id)

		sss.files.collection.findOne({ _id: oid }).then(fileinfo => {

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

			const caption =
					querystring.escape(fileinfo.metadata.caption || '')

			const contentDisposition =
					'inline;' + // or 'attachment' for downloads
					'filename=' +
					querystring.escape(fileinfo.filename)

			res.set({
				'Content-Length': fileinfo.length,
				'Content-Type': fileinfo.contentType,
				'Last-Modified': lastModified.toISOString(),
				'Content-Disposition': contentDisposition,
				//'ETag': 'W/' + oid.toString(),
				'X-Meta-Caption': caption
			})

			const stream = sss.files.bucket.openDownloadStream(oid)

			stream.once('error', next)

			stream.pipe(res)

		}).catch(next)
	}

	const docDeleteFile = (req, res, next) => {
		const file_id = mongoose.Types.ObjectId(req.params.id)

		sss.files.bucket.delete(file_id, next)

	}

	const postFileMeta = (req, res, next) => {

		const oid = mongoose.Types.ObjectId(req.params.id)
		const fieldName = 'caption' //req.params.field

		const allowed = {
			'caption': String
		}

		const contentType = req.headers['content-type']

		if ('application/json' !== contentType) {
			next(TypeError(`Invalid 'Content-Type': ${contentType}`))
			return;
		}

		for (const [k, v] of Object.entries(req.body)) {
			if (!allowed[k]) {
				next(RangeError(`Field '${k}' is not allowed`))
				return;
			}
		}

		req.body['lastModified'] = new Date()

		console.log('metadata::', req.body);

		const set = {}
		for (let [k, v] of Object.entries(req.body)) {
			set[`metadata.${k}`] = v
		}

		sss.files.collection.updateOne(
			{
				_id: oid
			},
			{
				$set: set
			}
		).then(result => {

			if (null === result) { // 404
				next()
				return;
			}

			console.log('modifiedCount', result.modifiedCount)

			res.send('ok')

		}).catch(next)
	}

	const getFilesList = (req, res, next) => {

		sss.files.collection.find(
			{
				'metadata.docId': res.locals.Doc._id
			}
		)
		.toArray()
		.then(
			result => {

				res.locals.Result =
						result.map(el => { return el._id })

				next()
			}
		).catch(next)

	}

// ==========================================================================

	app.post('/s',
		search
	)

// --------------------------------------------------------------------------

	app.get('/f/:id',
		getFile
	)

	app.post('/f/:id',
		postFileMeta
	)

	app.delete('/f/:id',
		docDeleteFile,
		sendResultJSON
	)

	// FIXME change POST to PUT, :filename to header
	app.post('/f/:id/upload/:filename',
		docLoad,
		fileUpload,
		sendResultJSON
	)

	// --------------------------------------------------------------------------

	app.get('/person/events',
		docEvents,
		sendResultJSON
	)

	// --------------------------------------------------------------------------

	app.get('/list/:schema',
		schemaResolve,
		docList,
		sendResultJSON
	)

	app.get('/doc/:id',
		docLoad,
		docAsResult,
		sendResultJSON
	)

	app.get('/doc/:id/files',
		docLoad,
		getFilesList,
		sendResultJSON
	)

	app.post('/doc/:id',
		docLoad,
		docUpdate,
		docAsResult,
		docSave,
		sendResultJSON
	)

	app.put('/doc',
		schemaResolve,
		docNew,
		docUpdate,
		docAsResult,
		docSave,
		sendResultJSON
	)

	app.use(express.static('public'))

// ==========================================================================

	app.listen(port, () => {
	  console.log(`Example app listening at http://localhost:${port}`)
	})

// --------------------------------------------------------------------------

}).catch(err => {
	console.error(err)
})
