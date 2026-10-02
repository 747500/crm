
import mongoose from 'mongoose'

import { User } from '../../model/index.mjs'

// Загружаем собственный mongoose-документ пользователя (и для auth, и для Update/Save).
// Раньше здесь был plain-объект из GraphQL, из-за чего POST /u (настройки) падал на req.User.schema.tree.
const Load = (req, res, next) => {
	let userId

	try {
		userId = mongoose.Types.ObjectId(req.session.user)
	}
	catch (err) {
		res.status(401).send('Access Denied')
		return
	}

	User.findOne({ _id: userId })
	.then(user => {
		if (null === user) {
			res.status(401).send('Access Denied')
			return
		}

		req.User = user
		next()
	})
	.catch(next)
}

export default Load
