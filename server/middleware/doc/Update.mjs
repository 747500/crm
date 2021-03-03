

const skip = {
	'_id': true,
	'__v': true,
	'kind': true,
	'id': true,
	'fts': true,
	'time': true,
	'mtime': true,
	'ctime': true,
}

const docUpdate = (req, res, next) => {

	//console.log('* docUpdate', req.body)

	var fieldsUpdated = 0

	Object.keys(res.locals.Doc.schema.tree).forEach(k => {

		if (skip[k]) {
			return
		}

		//console.log('>>>', k, req.body[k])

		if (k in req.body) {
			fieldsUpdated ++;
			res.locals.Doc[k] = req.body[k]
		}

	})

	if (0 === fieldsUpdated) {
		res.status(400).send('Can\'t find fields to update')
		return;
	}

	next()
}


export default docUpdate
