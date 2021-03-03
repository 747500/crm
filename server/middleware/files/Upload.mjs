

import querystring from 'querystring'
import mongoose from 'mongoose'

import ServicesRun from '../../services/index.mjs'


const Upload = (req, res, next) => {
	const userId = mongoose.Types.ObjectId(req.session.user)

	const doc = res.locals.Doc
	const filename = req.params.filename
	const mimetype = req.headers['content-type']
	const caption = req.headers['x-meta-caption']

	ServicesRun.then(services => {

		var stream = services.files.bucket.openUploadStream(
			filename,
			{
				contentType: mimetype,
				metadata: {
					user: userId,
					docId: mongoose.Types.ObjectId(doc.id),
					lastModified: new Date(req.headers['last-modified']),
					caption: querystring.unescape(caption)
				}
			}
		)

		stream.once('finish', () => {
			res.locals.Result = {
				file_id: stream.id
			}
			next()
		})

		stream.once('error', next)

	//		console.log('* after docUploadFile:', doc);

		req.pipe(stream)

	})
	.catch(next)

}

export default Upload
