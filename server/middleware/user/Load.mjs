
import mongoose from 'mongoose'

import { User } from '../../model/index.mjs'

import Services from '../../services/index.mjs'


const Load = (req, res, next) => {
	const userId = mongoose.Types.ObjectId(req.session.user).toString()

	const query =
`
{
	user(id: "${userId}") {
		name
		notifyBirthdayAt
		notifyTelegramId
		ctime
		mtime
	}
}
`
	Services.Run().then(({ amqp }) => {

		amqp.graphql(query, result => {

			//const user = result.data.users
			console.log(result.data || result.errors)

			if (!result.data.user) {
				res.status(401).send('Access Denied')
				return
			}

			req.User = result.data.user
			next()

			//res.send(users.map(user => {
			//	return {
			//		_id: user.id,
			//		name: user.name,
			//		current: user.id === req.session.user,
			//	}
			//}))

		})
		.catch(err => next(err))

	})

}

export default Load
