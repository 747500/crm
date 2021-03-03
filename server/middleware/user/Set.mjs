
import mongoose from 'mongoose'

const Set = (req, res, next) => {
	const userId = mongoose.Types.ObjectId(req.body._id)

	req.session.user = userId.toString()

	console.log('* user/Set', req.session.user)

	res.send('Ok')
}

export default Set
