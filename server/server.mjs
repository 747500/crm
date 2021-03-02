'use strict'

import querystring from 'querystring'

import moment from 'moment'
import sharp from 'sharp'

import mongoose from 'mongoose'
mongoose.Promise = global.Promise
import models from './db_schema.mjs'

import SphinxClient from 'sphinxapi'

import mysql from 'mysql'

import express from 'express'
import session from 'express-session'
import morgan from 'morgan'
morgan.token('session', req => {
	return `${req.sessionID}`
})

morgan.token('user', req => {
	const haveUser =
		'object' === typeof req.User

	if (haveUser) {
		return req.User.name
	}

	const haveSession =
		'object' === typeof req.session

	if (haveSession) {
		return req.session.user
	}

	return '-'
})

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

// https://github.com/jdesboeufs/connect-mongo
import connectMongo from 'connect-mongo'
const MongoStore = connectMongo.default

import CONFIG from './config.js'

// ==========================================================================

const SubSystems = [

	{
		name: 'sphinxql',
		init () {
			return new Promise((resolve, reject) => {

				var pool = mysql.createPool({
					connectionLimit: 1,
			    	localAddress: CONFIG.SphinQL.address,
			    	port: CONFIG.SphinQL.port,
			    })

				pool.on('error', err => reject(err))

				resolve(pool)
			})
		}
	},

	// --------------------------------------------------------------------------

	{
		name: 'docs',
		init () {
			return mongoose.connect(
				CONFIG.MongoDB.URI,
				CONFIG.MongoDB.options
			)
		}

	},

	// --------------------------------------------------------------------------

	{
		name: 'web',
		init () {
			return new Promise((resolve, reject) => {
				const app = express()
				const port = CONFIG.Express.port
				app.use(cookieParser(CONFIG.Express.Session.secret))
				//app.use(morgan('dev'))
				app.use(morgan('[:session :user] :method :url :status :response-time ms - :res[content-length]'))
				app.use(bodyParser.text())
				app.use(express.json())
				app.use(bodyParser.json())

				console.log('>>>', MongoStore.create);

				const sessionStore = MongoStore.create({
					mongoUrl: CONFIG.MongoDB.URI,
					collectionName: 'sessions',
					//touchAfter: 600,
					//crypto: {
					//	secret: 'blah'
					//},
					stringify: false,
				})

				/*
				sessionStore.on('create', (... args) => console.log('* Session create', args))
				sessionStore.on('touch', (... args) => console.log('* Session touch', args))
				sessionStore.on('update', (... args) => console.log('* Session update', args))
				sessionStore.on('set', (... args) => console.log('* Session set', args))
				sessionStore.on('destroy', (... args) => console.log('* Session destroy', args))
				*/

				app.set('trust proxy', 1) // trust first proxy
				app.use(session({
					secret: CONFIG.Express.Session.secret,
					resave: true,
					saveUninitialized: true,
					cookie: {
						secure: false,
						maxAge: CONFIG.Express.Session.maxAge
					},
					genid: () => mongoose.Types.ObjectId().toString(),
					store: sessionStore,
					//unset: // 'keep' | 'destroy'
				}))

				app.use((req, res, next) => {
					if (req.session.ip !== req.ip){
						req.session.ip = req.ip
					}
					next()
				})

				app
				.listen(port, () => {
					resolve(app)
					console.log(`\tlistening at http://localhost:${port}`)
				})
				.on('error', reject)

			})
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

				const ok = collection.createIndex('metadata.docId')
					.then(() => {
						return { collection, bucket }
					})

				resolve(ok)
			})
		},
	},

	// ----------------------------------------------------------------------

	{
		name: 'events',
		init () {

			return Promise.resolve()
		},
	},
]

// --------------------------------------------------------------------------

function runService (service) {

	console.log(`sss init "${service.name}"`)

	return service.init.bind(this)().then(
		result => {
			console.log('\tok')
			service.endpoint = result
			return result
		}
	)
}

function sssInit (arg) {
	const sss = {}

	return arg.reduce(
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

// ==========================================================================

sssInit(SubSystems).then(sss => {

// ==========================================================================

	const search = (req, res, next) => {
		const userId = mongoose.Types.ObjectId(req.session.user)

		console.log('<search>', req.body)

		const searchString = req.body.q

		const queryArgs = []
		var query = 'SELECT * FROM testrt WHERE user = ? AND MATCH(?)'

		queryArgs.push(userId.toString())
		queryArgs.push(req.body.q)

		if (req.body.kind) {
			let n = queryArgs.length

			if ((req.body.kind instanceof Array) && req.body.kind.length) {
				queryArgs.push(req.body.kind)
			}
			else
			if ('string' === typeof req.body.kind) {
				queryArgs.push(req.body.kind)
			}

			if (queryArgs.length !== n) {
				query += ' AND kind IN (?)'
			}
		}

		console.log('###', {
			q: query,
			a: queryArgs
		})

		sss.sphinxql.query(
			query, queryArgs,
			(err, rows, fields) => {

				if (err) {
					next(err)
					return
				}

				console.log('* Sphinx SELECT', rows.length)

				sss.sphinxql.query(
					'SHOW META LIKE ?',
					[ 'total_found' ],
					(err, meta, fields) => {

						if (err) {
							console.error(err)
							return
						}

						console.log('* Sphinx total_found:', meta[0].Value)
						//res.send(rows)

						res.send({
							total_found: meta[0].Value,
							result: rows
						})
					}
				)
			}
		)
	}

// --------------------------------------------------------------------------

	const docAsResult = (req, res, next) => {
		var doc = res.locals.Doc

		res.locals.Result = doc.toObject()

		// delete res.locals.Result.__v

		next()
	}

	const sendResultJSON = (req, res) => {
		res.send(res.locals.Result)
	}

	const docList = (req, res, next) => {
		const userId = mongoose.Types.ObjectId(req.session.user)

		var ok = res.locals.Schema.find(
			{
				user: userId
			}
		)

		switch (res.locals.kind) {

			case 'person':
				ok = ok.sort({
					'person.lastName': 1,
					'person.firstName': 1,
					'person.middleName': 1,
				})
				break;

			case 'property':
				ok = ok.sort({
					'mtime': -1,
				})
				break;

		}

		ok.then(
			result => {
				res.locals.Result = result
				next()
			}
		)
		.catch(next)

	}

	const docEvents = (req, res, next) => {
		const userId = mongoose.Types.ObjectId(req.session.user)

		console.log('* docEvents\n', req.query)


		const month = parseInt(moment(req.query.yearmonth).format('MM'))
		console.log('* docEvents\n', month)

		models.Doc.aggregate([
			{
				$project: {
					_id: true,
					kind: true,
					user: true,
					firstName: '$person.firstName',
					middleName: '$person.middleName',
					lastName: '$person.lastName',
					birthDay: '$person.birthDay',
					month: {
						$month: '$person.birthDay'
					}
				}
			},
			{
				$match: {
					user: userId,
					kind: 'person',
					month: month
				}
			}
		])
		.then(result => {
			console.log('* docEvents\n', result)

			res.locals.Result = result.map(i => {

				const birthDate = moment(i.birthDay).format('DD-MM-YYYY')
				const day = moment(i.birthDay).format('DD')
				const eventDate = `${req.query.yearmonth}-${day}`
				const age = 1 + moment(eventDate).diff(i.birthDay, 'years');

				return {
					eventAt: eventDate,
					eventTitle: `ДР - ${age}`,
					subjectId: i._id.toString(),
				}
			})
			next()
		})
		.catch(next)
	}

	const docLoad = (req, res, next) => {
		const userId = mongoose.Types.ObjectId(req.session.user)

		models.Doc.findOne({
			_id: req.params.id,
			user: userId,
		})
		.then(result => {

			if (null === result) {
				res.status(404).send('Doc not found')
				return
			}

			//console.log('* docLoad:\n', result.toObject())
			res.locals.Doc = result
			next()
		})
		.catch(err => {

			if (err instanceof mongoose.Error.CastError) {
				res.status(400).send(err.toString())
				return
			}

			next(err)
		})

	}

	const docUpdate = (req, res, next) => {

		const skip = {
			'_id': true,
			'__v': true,
			'kind': true,
			'id': true,
			'fts': true,
			'time': true,
			'mtime': true,
			'ctime': true,
		}

		console.log('* docUpdate', req.body)

		var fieldsUpdated = 0

		Object.keys(res.locals.Doc.schema.tree).forEach(k => {

			if (skip[k]) {
				return
			}

			console.log('>>>', k, req.body[k])

			if (k in req.body) {
				fieldsUpdated ++;
				res.locals.Doc[k] = req.body[k]
			}

		})

		if (0 === fieldsUpdated) {
			res.status(400).send('Can\'t find fields to update')
			return;
		}

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
		res.locals.kind = sName

		if (! res.locals.Schema ) {
			next(Error(`Undefined Schema: ${sName}`))
			return
		}

		next()
	}

	const docNew = (req, res, next) => {
		const userId = mongoose.Types.ObjectId(req.session.user)

		try {
			res.locals.Doc = new res.locals.Schema({
				user: userId
			})
		}
		catch (err) {
			next(err)
			return
		}

		next()
	}

	const docSave = (req, res, next) => {

		const doc = res.locals.Doc

		//console.log('* docSave input\n', doc.toObject())

		doc.save()
		.then((result) => {
			//console.log('* docSave result\n', result)
			next()
		})
		.catch(next)

	}

	const fileUpload = (req, res, next) => {
		const userId = mongoose.Types.ObjectId(req.session.user)

		const doc = res.locals.Doc
		const filename = req.params.filename
		const mimetype = req.headers['content-type']
		const caption = req.headers['x-meta-caption']

		var stream = sss.files.bucket.openUploadStream(
			filename,
			{
				contentType: mimetype,
				metadata: {
					user: userId,
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

	const getThumbnail = (req, res, next) => {
		const userId = mongoose.Types.ObjectId(req.session.user)

		const oid = mongoose.Types.ObjectId(req.params.id)

		sss.files.collection.findOne({
			_id: oid,
			'metadata.user': userId,
		})
		.then(fileinfo => {

			if (null === fileinfo) { // 404
				res.status(404).send('File Not Found')
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

			res.set({
				//'Content-Length': fileinfo.length,
				'Content-Type': 'image/jpeg',
				'Last-Modified': lastModified.toISOString(),
				'X-Meta-Caption': caption
			})

			const stream = sss.files.bucket.openDownloadStream(oid)

			stream.once('error', next)

			const resize = sharp({
				pages: 1
			}).resize(350).jpeg()

			resize.once('error', next)

			stream.pipe(resize).pipe(res)

		})
		.catch(next)

	}

	const getFile = (req, res, next) => {
		const userId = mongoose.Types.ObjectId(req.session.user)

		const fileId = mongoose.Types.ObjectId(req.params.id)

		sss.files.collection.findOne({
			_id: fileId,
			'metadata.user': userId,
		})
		.then(fileinfo => {

			if (null === fileinfo) { // 404
				res.status(404).send('File Not Found')
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

		})
		.catch(next)
	}

	const docDeleteFile = (req, res, next) => {
		const userId = mongoose.Types.ObjectId(req.session.user)
		const fileId = mongoose.Types.ObjectId(req.params.id)

		sss.files.collection.findOne({
			_id: fileId,
			'metadata.user': userId,
		})
		.then(result => {
			if (null === result) { // 404
				res.status(404).send('File Not Found')
				return;
			}

			sss.files.bucket.delete(fileId, (err, result) => {
				if (err) {
					next(err)
					return
				}

				console.log('* docDeleteFile result', result)
				res.send(result)
			})

		})
		.catch(next)


	}

	const postFileMeta = (req, res, next) => {
		const userId = mongoose.Types.ObjectId(req.session.user)

		const fileId = mongoose.Types.ObjectId(req.params.id)
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
				_id: fileId,
				'metadata.user': userId
			},
			{
				$set: set
			}
		)
		.then(result => {

			if (null === result) { // 404
				res.status(404).send('File Not Found')
				return;
			}

			console.log('modifiedCount', result.modifiedCount)

			res.send('ok')

		})
		.catch(next)
	}

	const getFilesList = (req, res, next) => {
		const userId = mongoose.Types.ObjectId(req.session.user)

		sss.files.collection.find(
			{
				'metadata.user': userId,
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

	const fulltextAdd = (req, res, next) => {
		const doc = res.locals.Doc
		const id = doc.ctime.getTime()
		const docFts = doc.fts

		console.log('* fulltextAdd:', docFts)

		sss.sphinxql.query(
			//'UPDATE testrt SET content = ?, kind = ?, oid = ? WHERE id = ?',
			'INSERT INTO testrt (id, content, user, oid, kind) VALUES (?, ?, ?, ?, ?)',
			[
				id,
				docFts.join(' '),
				doc.user.toString(),
				doc._id.toString(),
				doc.kind
			],
			(err, row, fields) => {
				if (err) {
					next(err)
					return
				}

				console.log('* fulltextAdd:', row)

				next()

			}
		)
	}

	const fulltextUpdate = (req, res, next) => {
		const doc = res.locals.Doc
		const id = doc.ctime.getTime()
		const docFts = doc.fts

		console.log(
			'* fulltextUpdate:',
			{
				user: doc.user,
				_id: doc._id,
				kind: doc.kind,
				fts: docFts,
				sphinxId: id,
			}
		)

		sss.sphinxql.query(
			'DELETE FROM testrt WHERE oid = ?',
			[ doc._id.toString() ],
			(err, row, fields) => {
				if (err) {
					next(err)
					return
				}

				console.log('* fulltextUpdate deleted:', row.affectedRows)

				sss.sphinxql.query(
					'REPLACE INTO testrt (id, content, user, oid, kind) VALUES (?, ?, ?, ?, ?)',
					[
						id,
						docFts.join(' '),
						doc.user.toString(),
						doc._id.toString(),
						doc.kind
					],
					(err, row, fields) => {
						if (err) {
							next(err)
							return
						}

						console.log('* fulltextUpdate:', row.affectedRows)

						next()

					}
				)

			}
		)

	}

// ==========================================================================

	const users = (req, res, next) => {

		models.User.find()
		.then(result => {
			res.send(result.map(user => {
				return {
					_id: user._id,
					name: user.name,
					current: req.session.user === user._id.toString(),
				}
			}))
		})
		.catch(next)

	}

	const usersSet = (req, res, next) => {

		req.session.user = req.body._id

		console.log('* usersSet', req.session.user)

		res.send('Ok')
	}

	const usersCreate = (req, res, next) => {

		const haveUser =
			'string' === typeof req.body.name &&
			0 < req.body.name.length

		if (!haveUser) {
			res.status(400).send('Invalid or empty user name')
			return
		}

		const user = new models.User({
			name: req.body.name
		})

		user.save()
		.then(result => {
			res.send(result)
		})
		.catch(err => next(err))
	}

	const loadUser = (req, res, next) => {
		const userId = mongoose.Types.ObjectId(req.session.user)

		models.User.findOne(
			{ _id: userId }
		)
		.then(result => {
			if (null === result) {
				res.status(401).send('Access Denied')
				return
			}
			req.User = result

			//console.log('* loadUser', req.User)

			next()

		})
		.catch(err => next(err))

	}

// ==========================================================================

	sss.web.post('/u/set',
		usersSet
	)

	sss.web.get('/u',
		users
	)

	sss.web.put('/u',
		usersCreate
	)

	sss.web.use(loadUser)

// ==========================================================================
// AUTHENICATED ZONE BELOW
// ==========================================================================

	sss.web.post('/s',
		search
	)

// --------------------------------------------------------------------------

	sss.web.get('/t/:id',
		getThumbnail
	)

	sss.web.get('/f/:id',
		getFile
	)

	sss.web.post('/f/:id',
		postFileMeta
	)

	sss.web.delete('/f/:id',
		docDeleteFile,
		sendResultJSON
	)

	// FIXME change POST to PUT, :filename to header
	sss.web.post('/f/:id/upload/:filename',
		docLoad,
		fileUpload,
		sendResultJSON
	)

	// --------------------------------------------------------------------------

	sss.web.get('/person/events',
		docEvents,
		sendResultJSON
	)

	// --------------------------------------------------------------------------

	sss.web.get('/list/:schema',
		schemaResolve,
		docList,
		sendResultJSON
	)

	// --------------------------------------------------------------------------

	sss.web.get('/doc/:id',
		docLoad,
		docAsResult,
		sendResultJSON
	)

	sss.web.get('/doc/:id/files',
		docLoad,
		getFilesList,
		sendResultJSON
	)

	sss.web.post('/doc/:id',
		docLoad,
		docUpdate,
		docSave,
		docAsResult,
		fulltextUpdate,
		sendResultJSON
	)

	sss.web.put('/doc',
		schemaResolve,
		docNew,
		docUpdate,
		docSave,
		docAsResult,
		fulltextAdd,
		sendResultJSON
	)

	sss.web.use(express.static('public'))

// ==========================================================================

}).catch(err => {
	console.error('FATAL:', err)
})
