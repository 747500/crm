
import express from 'express'

import mw from '../middleware/index.mjs'


const docs = express.Router()

docs.post('/s',
	mw.doc.Search.Query
)

docs.get('/:id',
	mw.doc.Load,
	mw.doc.AsResult
)

docs.get('/:id/files',
	mw.doc.Load,
	mw.files.List
)

docs.post('/:id',
	mw.doc.Load,
	mw.doc.Update,
	mw.doc.Save,
	mw.doc.AsResult,
	mw.doc.Search.Update
)

docs.put('/',
	mw.doc.ResolveSchema,
	mw.doc.New,
	mw.doc.Update,
	mw.doc.Save,
	mw.doc.AsResult,
	mw.doc.Search.Add
)

docs.use(
	mw.sendResultJSON
)

export default docs
