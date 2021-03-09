
import mongoose from 'mongoose'

import Services from '../../../services/index.mjs'

const Save = (req, res, next) => {
	const userId = mongoose.Types.ObjectId(req.session.user)
	const fileId = mongoose.Types.ObjectId(req.params.id)
	const fieldName = 'caption' //req.params.field

	const allowed = {
		'caption': String
	}

	const contentType = req.headers['content-type']

	if ('application/json' !== contentType) {
		next(TypeError(`Invalid 'Content-Type': ${contentType}`))
		return;
	}

	for (const [k, v] of Object.entries(req.body)) {
		if (!allowed[k]) {
			next(RangeError(`Field '${k}' is not allowed`))
			return;
		}
	}

	req.body['lastModified'] = new Date()

	console.log('metadata::', req.body);

	const set = {}
	for (let [k, v] of Object.entries(req.body)) {
		set[`metadata.${k}`] = v
	}

	Services.Run()
	.then(services => {
		return services.gridfs.collection.updateOne(
			{
				_id: fileId,
				'metadata.user': userId
			},
			{
				$set: set
			}
		)
		.then(result => {

			if (null === result || 0 === result.modifiedCount) { // 404
				res.status(404).send('File Not Found')
				return;
			}

			next()
		})

	})
	.catch(next)
}

export default Save
