
import querystring from 'querystring'
import mongoose from 'mongoose'

import ServicesRun from '../../services/index.mjs'

const StreamContent = (req, res, next) => {
	const userId = mongoose.Types.ObjectId(req.session.user)
	const fileId = mongoose.Types.ObjectId(req.params.id)

	ServicesRun.then(services => {

		return services.files.collection.findOne({
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

			const contentDisposition =
					'inline;' + // or 'attachment' for downloads
					'filename=' +
					querystring.escape(fileinfo.filename)

			res.set({
				'Content-Length': fileinfo.length,
				'Content-Type': fileinfo.contentType,
				'Last-Modified': lastModified.toISOString(),
				'Content-Disposition': contentDisposition,
				//'ETag': 'W/' + fileId.toString(),
				'X-Meta-Caption': caption
			})

			const stream = services.files.bucket.openDownloadStream(fileId)

			stream.once('error', next)

			stream.pipe(res)

		})

	})
	.catch(next)
}


export default StreamContent
