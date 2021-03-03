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



ServicesRun.then(services => {

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

	const getThumbnail = (req, res, next) => {
		const userId = mongoose.Types.ObjectId(req.session.user)

		const oid = mongoose.Types.ObjectId(req.params.id)

		services.files.collection.findOne({
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

			const stream = services.files.bucket.openDownloadStream(oid)

			stream.once('error', next)

			const resize = sharp({
				pages: 1
			}).resize(350).jpeg()

			resize.once('error', next)

			stream.pipe(resize).pipe(res)

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

		services.files.collection.updateOne(
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

// ==========================================================================

	services.web.post('/u/set',
		mw.user.Set
	)

	services.web.get('/u',
		mw.user.List
	)

	services.web.put('/u',
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
		mw.files.StreamContent
	)

	apiRouter.post('/f/:id',
		postFileMeta
	)

	apiRouter.delete('/f/:id',
		mw.files.Delete,
		mw.sendResultJSON
	)

	// FIXME change POST to PUT, :filename to header
	apiRouter.post('/f/:id/upload/:filename',
		mw.doc.Load,
		mw.files.Upload,
		mw.sendResultJSON
	)

// --------------------------------------------------------------------------

	apiRouter.get('/person/events',
		docEvents,
		mw.sendResultJSON
	)

// --------------------------------------------------------------------------

	apiRouter.get('/list/:schema',
		mw.doc.ResolveSchema,
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
		mw.files.List
	)

	docRouter.post('/:id',
		mw.doc.Load,
		mw.doc.Update,
		mw.doc.Save,
		mw.doc.AsResult,
		mw.doc.Search.Update
	)

	docRouter.put('/',
		mw.doc.ResolveSchema,
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

	services.web.use('/', apiRouter)
	services.web.use(express.static('public'))

// ==========================================================================

}).catch(err => {
	console.error('FATAL:', err)

	process.kill(process.pid, 'SIGTERM')
})
