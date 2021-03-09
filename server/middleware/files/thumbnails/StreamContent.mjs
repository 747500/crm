
import querystring from 'querystring'
import mongoose from 'mongoose'
import sharp from 'sharp'

import Services from '../../../services/index.mjs'


const StreamContent = (req, res, next) => {
	const userId = mongoose.Types.ObjectId(req.session.user)
	const fileId = mongoose.Types.ObjectId(req.params.id)

	Services.Run()
	.then(services => {

		return services.gridfs.collection.findOne({
			_id: fileId,
			'metadata.user': userId,
		})
		.then(filemeta => {

			if (null === filemeta) { // 404
				res.status(404).send('File Not Found')
				return;
			}

			const [ content, type ] = filemeta.contentType.split('/')

			const hasLastModified =
					'object' === typeof filemeta.metadata &&
					filemeta.metadata.lastModified instanceof Date

			const lastModified =
					hasLastModified ?
					filemeta.metadata.lastModified :
					filemeta.uploadDate

			const caption =
					querystring.escape(filemeta.metadata.caption || '')

			res.set({
				//'Content-Length': filemeta.length,
				'Last-Modified': lastModified.toISOString(),
				'X-Meta-Caption': caption
			})

			if ('image' !== content) {

				res.status(400).send({
					error: 'Bad request: not an "Image"'
				})
				return
			}

			res.set({
				//'Content-Length': filemeta.length,
				'Content-Type': 'image/jpeg',
			})

			const stream = services.gridfs.bucket.openDownloadStream(fileId)

			stream.once('error', next)

			const resize = sharp({
				pages: 1
			})
			.resize(350)
			.jpeg()

			resize.once('error', next)

			stream.pipe(resize).pipe(res)

		})

	})
	.catch(next)

}

export default StreamContent
