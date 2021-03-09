
import express from 'express'

import mw from '../middleware/index.mjs'

const files = express.Router()

files.get('/meta/:id',
	mw.files.meta.Query,
	mw.sendResultJSON
)

files.post('/meta/:id',
	mw.files.meta.Save,
	mw.files.meta.Query,
	mw.sendResultJSON
)

files.get('/:id/t',
	mw.files.thumbnails.StreamContent
)

files.get('/:id',
	mw.files.StreamContent
)

files.delete('/:id',
	mw.files.Delete,
	mw.sendResultJSON
)

// FIXME change POST to PUT, :filename to header
files.post('/:id/upload/:filename',
	mw.doc.Load,
	mw.files.Upload,
	mw.sendResultJSON
)

export default files
