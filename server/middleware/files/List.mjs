
import mongoose from 'mongoose'

import Services from '../../services/index.mjs'

const List = (req, res, next) => {
	const userId = mongoose.Types.ObjectId(req.session.user)

	Services.Run()
	.then(services => {

		return services.gridfs.collection.find(
			{
				'metadata.user': userId,
				'metadata.docId': res.locals.Doc._id
			}
		)
		.toArray()
		.then(
			result => {

				res.locals.Result =
						result.map(el => { return el._id })

				next()
			}
		)

	})
	.catch(next)

}


export default List
