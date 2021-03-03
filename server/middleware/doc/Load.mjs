
import mongoose from 'mongoose'

import Models from '../../db_schema.mjs'

const docLoad = (req, res, next) => {
	const userId = mongoose.Types.ObjectId(req.session.user)

	Models.Doc.findOne({
		_id: req.params.id,
		user: userId,
	})
	.then(result => {

		if (null === result) {
			res.status(404).send('Doc not found')
			return
		}

		//console.log('* mw.doc.Load:\n', result.toObject())

		res.locals.Doc = result
		next()
	})
	.catch(err => {

		//console.log('* mw.doc.Load:', err)

		if (err instanceof mongoose.Error.CastError) {
			res.status(400).send(err.toString())
			return
		}

		next(err)
	})

}

export default docLoad
