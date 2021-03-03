
import mongoose from 'mongoose'

import Models from '../../db_schema.mjs'


const Load = (req, res, next) => {
	const userId = mongoose.Types.ObjectId(req.session.user)

	Models.User.findOne(
		{ _id: userId }
	)
	.then(result => {
		if (null === result) {
			res.status(401).send('Access Denied')
			return
		}
		req.User = result

		//console.log('* loadUser', req.User)

		next()

	})
	.catch(err => next(err))

}

export default Load
