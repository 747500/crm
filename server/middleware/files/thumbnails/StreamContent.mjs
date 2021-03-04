
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
		.then(fileinfo => {

			if (null === fileinfo) { // 404
				res.status(404).send('File Not Found')
				return;
			}

			const hasLastModified =
					'object' === typeof fileinfo.metadata &&
					fileinfo.metadata.lastModified instanceof Date

			const lastModified =
					hasLastModified ?
					fileinfo.metadata.lastModified :
					fileinfo.uploadDate

			const caption =
					querystring.escape(fileinfo.metadata.caption || '')

			res.set({
				//'Content-Length': fileinfo.length,
				'Content-Type': 'image/jpeg',
				'Last-Modified': lastModified.toISOString(),
				'X-Meta-Caption': caption
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
