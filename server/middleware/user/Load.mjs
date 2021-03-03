
import mongoose from 'mongoose'

import model from '../../model/index.mjs'


const Load = (req, res, next) => {
	const userId = mongoose.Types.ObjectId(req.session.user)

	model.User.findOne(
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
