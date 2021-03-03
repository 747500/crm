
import mongoose from 'mongoose'

import servicesRun from '../../services/index.mjs'

const List = (req, res, next) => {
	const userId = mongoose.Types.ObjectId(req.session.user)

	servicesRun
	.then(services => {

		return services.files.collection.find(
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
