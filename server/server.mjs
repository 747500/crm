'use strict'

import querystring from 'querystring'

import moment from 'moment'
import sharp from 'sharp'

import express from 'express'
import mongoose from 'mongoose'
//mongoose.Promise = global.Promise

import models from './db_schema.mjs'

import ServicesRun from './services/index.mjs'

import CONFIG from './config.js'

import mw from './middleware/index.mjs'

// ==========================================================================

ServicesRun.then(sss => {

// ==========================================================================

// --------------------------------------------------------------------------

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

			sss.files.bucket.delete(fileId, (err) => {
				if (err) {
					next(err)
					return
				}

				console.log('* docDeleteFile deleted:', {
					user: userId,
					file: fileId,
				})
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

// ==========================================================================

	sss.web.post('/u/set',
		mw.user.Set
	)

	sss.web.get('/u',
		mw.user.List
	)

	sss.web.put('/u',
		mw.user.Create
	)

// --------------------------------------------------------------------------

	const apiRouter = express.Router()

	apiRouter.use(mw.user.Load) // AUTHENICATED ZONE BELOW

// --------------------------------------------------------------------------

	apiRouter.get('/t/:id',
		getThumbnail
	)

	apiRouter.get('/f/:id',
		getFile
	)

	apiRouter.post('/f/:id',
		postFileMeta
	)

	apiRouter.delete('/f/:id',
		docDeleteFile,
		mw.sendResultJSON
	)

	// FIXME change POST to PUT, :filename to header
	apiRouter.post('/f/:id/upload/:filename',
		mw.doc.Load,
		fileUpload,
		mw.sendResultJSON
	)

// --------------------------------------------------------------------------

	apiRouter.get('/person/events',
		docEvents,
		mw.sendResultJSON
	)

// --------------------------------------------------------------------------

	apiRouter.get('/list/:schema',
		schemaResolve,
		mw.doc.List,
		mw.sendResultJSON
	)

// --------------------------------------------------------------------------

	const docRouter = express.Router()

	docRouter.post('/s',
		mw.doc.Search.Query
	)

	docRouter.get('/:id',
		mw.doc.Load,
		mw.doc.AsResult
	)

	docRouter.get('/:id/files',
		mw.doc.Load,
		getFilesList
	)

	docRouter.post('/:id',
		mw.doc.Load,
		mw.doc.Update,
		mw.doc.Save,
		mw.doc.AsResult,
		mw.doc.Search.Update
	)

	docRouter.put('/',
		schemaResolve,
		mw.doc.New,
		mw.doc.Update,
		mw.doc.Save,
		mw.doc.AsResult,
		mw.doc.Search.Add
	)

	docRouter.use(
		mw.sendResultJSON
	)

	apiRouter.use('/doc', docRouter)

// --------------------------------------------------------------------------

	sss.web.use('/', apiRouter)
	sss.web.use(express.static('public'))

// ==========================================================================

}).catch(err => {
	console.error('FATAL:', err)

	process.kill(process.pid, SIGTERM)
})
