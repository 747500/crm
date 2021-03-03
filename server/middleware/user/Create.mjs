
import Models from '../../db_schema.mjs'

const Create = (req, res, next) => {

	const haveUser =
		'string' === typeof req.body.name &&
		0 < req.body.name.length

	if (!haveUser) {
		res.status(400).send('Invalid or empty user name')
		return
	}

	const user = new Models.User({
		name: req.body.name
	})

	user.save()
	.then(result => {
		res.send(result)
	})
	.catch(err => next(err))
}

export default Create
