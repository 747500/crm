
import mongoose from 'mongoose'

const Session = (req, res, next) => {
	const userId = mongoose.Types.ObjectId(req.body._id).toString()

	if (userId !== req.session.user) {
		req.session.user = userId
		console.log('* user/Session', req.session.user)
	}

	res.send('Ok')
}

export default Session
