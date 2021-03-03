
import express from 'express'

import mw from '../middleware/index.mjs'

const Users = express.Router()

Users.post('/set',
	mw.user.Set
)

Users.get('/',
	mw.user.List
)

Users.put('/',
	mw.user.Create
)

export default Users
