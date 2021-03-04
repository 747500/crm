
import mongoose from 'mongoose'

import Services from '../../services/index.mjs'


const Delete = (req, res, next) => {
	const userId = mongoose.Types.ObjectId(req.session.user)
	const fileId = mongoose.Types.ObjectId(req.params.id)

	Services.Run()
	.then(services => {

		return services.gridfs.collection.findOne({
			_id: fileId,
			'metadata.user': userId,

		})
		.then(result => {
			if (null === result) { // 404
				res.status(404).send('File Not Found')
				return;
			}

			services.gridfs.bucket.delete(fileId, (err) => {
				if (err) {
					next(err)
					return
				}

				console.log('* mw.files.Delete Ok:', {
					user: userId,
					file: fileId,
				})
				res.send(result)
			})

		})
	})
	.catch(next)
}

export default Delete
