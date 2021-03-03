
import express from 'express'

import Users from './users.mjs'
import Docs from './docs.mjs'
import Files from './files.mjs'

import mw from '../middleware/index.mjs'

// --------------------------------------------------------------------------

const apiRouter = express.Router()

apiRouter.use('/u', Users)
apiRouter.use(mw.user.Load) // AUTHENICATED ZONE BELOW
apiRouter.use('/f', Files)
apiRouter.use('/doc', Docs)


export default apiRouter
