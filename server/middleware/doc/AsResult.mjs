

const docAsResult = (req, res, next) => {
	var doc = res.locals.Doc

	res.locals.Result = doc.toObject()

	// delete res.locals.Result.__v

	next()
}

export default docAsResult
