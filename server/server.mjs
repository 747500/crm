'use strict'

import express from 'express'

import ServicesRun from './services/index.mjs'

import CONFIG from './config.js'

import mw from './middleware/index.mjs'

ServicesRun.then(services => {

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

	services.web.use(express.static('public'))

	const apiRouter = express.Router()

	apiRouter.use(mw.user.Load) // AUTHENICATED ZONE BELOW

// --------------------------------------------------------------------------

	apiRouter.get('/t/:id',
		mw.files.thumbnails.StreamContent
	)

	apiRouter.get('/f/:id',
		mw.files.StreamContent
	)

	apiRouter.post('/f/:id',
		mw.files.meta.Save
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
		mw.doc.Events,
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

// ==========================================================================

}).catch(err => {
	console.error('FATAL:', err)

	process.kill(process.pid, 'SIGTERM')
})
