
import express from 'express'

import Users from './users.mjs'
import Docs from './docs.mjs'

import mw from '../middleware/index.mjs'

// --------------------------------------------------------------------------

const apiRouter = express.Router()

apiRouter.use('/u', Users)

// AUTHENICATED ZONE BELOW

apiRouter.use(mw.user.Load)

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

apiRouter.use('/doc', Docs)

// --------------------------------------------------------------------------

export default apiRouter
