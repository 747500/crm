
import express from 'express'

import mw from '../middleware/index.mjs'

const Users = express.Router()

Users.post('/set',
	mw.user.Session
)

Users.get('/list',
	mw.user.List
)

Users.get('/info',
	mw.user.Load,
	mw.user.AsResult,
	mw.sendResultJSON
)

Users.put('/',
	mw.user.Create
)

export default Users
