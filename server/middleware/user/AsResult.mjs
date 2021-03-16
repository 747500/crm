

const AsResult = (req, res, next) => {
	var user = req.User

	res.locals.Result = user.toObject()

	// delete res.locals.Result.__v

	next()
}

export default AsResult
