import mongoose from 'mongoose'

import Services from '../../../services/index.mjs'

const Query = (req, res, next) => {
	const userId = mongoose.Types.ObjectId(req.session.user)
	const fileId = mongoose.Types.ObjectId(req.params.id)

	Services.Run()
	.then(services => {
		return services.gridfs.collection.findOne(
			{
				_id: fileId,
				'metadata.user': userId,
			}
		)
		.then(filemeta => {

			if (null === filemeta) {
				res.status(404).send({
					error: 'File Not Found'
				})
				return
			}

			const hasLastModified =
					'object' === typeof filemeta.metadata &&
					filemeta.metadata.lastModified instanceof Date

			const lastModified =
					hasLastModified ?
					filemeta.metadata.lastModified :
					filemeta.uploadDate

			res.set({
				'Last-Modified': lastModified.toISOString(),
			})

			res.locals.Result = {
				_id: filemeta._id,
				contentType: filemeta.contentType,
				filename: filemeta.filename,
				length: filemeta.length,
				ctime: filemeta.uploadDate,
				mtime: filemeta.metadata.lastModified,
				meta: {
					caption: filemeta.metadata.caption,
				}
			}

			next()
		})
	})
	.catch(next)

}

export default Query
