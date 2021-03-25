

const AsResult = (req, res, next) => {
	var user = req.User

	if ('function' === typeof user.toObject) {
		res.locals.Result = user.toObject()
	}
	else {
		res.locals.Result = user
	}

	// delete res.locals.Result.__v

	next()
}

export default AsResult
