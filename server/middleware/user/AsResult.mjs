

const AsResult = (req, res, next) => {
	var user = req.User

	if ('function' === typeof user.toObject) {
		res.locals.Result = user.toObject()
	}
	else {
		res.locals.Result = user
	}

	if (res.locals.Result && res.locals.Result._id && !res.locals.Result.id) {
		res.locals.Result.id = String(res.locals.Result._id)
	}

	// delete res.locals.Result.__v

	next()
}

export default AsResult
