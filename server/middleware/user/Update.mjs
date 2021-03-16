

const skip = {
	'_id': true,
	'__v': true,
	'mtime': true,
	'ctime': true,
}

const Update = (req, res, next) => {

	var fieldsUpdated = 0

	Object.keys(req.User.schema.tree).forEach(k => {

		if (skip[k]) {
			return
		}

		// console.log('\t|', k, req.body[k])

		if (k in req.body) {
			fieldsUpdated ++;
			req.User[k] = req.body[k]
		}

	})

	// console.log('* mw.doc.Update fieldsUpdated:', fieldsUpdated)

	if (0 === fieldsUpdated) {
		res.status(400).send('Can\'t find fields to update')
		return;
	}

	next()
}


export default Update
