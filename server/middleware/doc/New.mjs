
import mongoose from 'mongoose'

const docNew = (req, res, next) => {
	const userId = mongoose.Types.ObjectId(req.session.user)

	try {
		res.locals.Doc = new res.locals.Schema({
			user: userId
		})
	}
	catch (err) {
		next(err)
		return
	}

	next()
}

export default docNew
