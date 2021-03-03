

const sendResultJSON = (req, res) => {
	res.send(res.locals.Result)
}


export default sendResultJSON
