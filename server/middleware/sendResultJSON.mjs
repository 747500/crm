

const sendResultJSON = (req, res, next) => {
	const result = res.locals.Result

	if ('undefined' === typeof result) {
		res.status(204).end()
		return
	}

	res.send(result)
}


export default sendResultJSON
