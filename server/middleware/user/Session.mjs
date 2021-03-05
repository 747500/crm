
import mongoose from 'mongoose'

const Session = (req, res, next) => {
	const userId = mongoose.Types.ObjectId(req.body._id)

	req.session.user = userId.toString()

	console.log('* user/Session', req.session.user)

	res.send('Ok')
}

export default Session
