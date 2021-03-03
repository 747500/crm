
import mongoose from 'mongoose'

import model from '../../model/index.mjs'


const Create = (req, res, next) => {
	const userId = mongoose.Types.ObjectId()

	const haveUser =
		'string' === typeof req.body.name &&
		0 < req.body.name.length

	if (!haveUser) {
		res.status(400).send('Invalid or empty user name')
		return
	}

	const user = new model.User({
		_id: userId,
		name: req.body.name,
	})

	user.save()
	.then(result => {
		res.send(result)
	})
	.catch(err => next(err))
}

export default Create
