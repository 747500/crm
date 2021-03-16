
import express from 'express'

import mw from '../middleware/index.mjs'

const Users = express.Router()

Users.post('/set',
	mw.user.Session
)

Users.get('/list',
	mw.user.List
)

Users.put('/',
	mw.user.Create
)

Users.post('/',
	mw.user.Load,
	mw.user.Update,
	mw.user.Save,
	mw.user.AsResult,
	mw.sendResultJSON
)

Users.get('/info',
	mw.user.Load,
	mw.user.AsResult,
	mw.sendResultJSON
)


export default Users
