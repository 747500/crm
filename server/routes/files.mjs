
import express from 'express'

import mw from '../middleware/index.mjs'

const files = express.Router()

files.get('/:id/t',
	mw.files.thumbnails.StreamContent
)

files.get('/:id',
	mw.files.StreamContent
)

files.post('/:id',
	mw.files.meta.Save
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
