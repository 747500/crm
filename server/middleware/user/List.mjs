
import model from '../../model/index.mjs'

const List = (req, res, next) => {

	model.User.find()
	.then(result => {
		res.send(result.map(user => {
			const userId = user._id.toString()
			return {
				_id: userId,
				name: user.name,
				current: userId === req.session.user,
			}
		}))
	})
	.catch(next)

}

export default List
