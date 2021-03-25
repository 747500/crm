
import Services from '../../services/index.mjs'

const queryUsers = `{
	users {
		id
		name
	}
}
`

const List = (req, res, next) => {

	Services.Run().then(({ amqp }) => {

		amqp.graphql(queryUsers, result => {

			const users = result.data.users
			//console.log(result.data)

			res.send(users.map(user => {
				return {
					_id: user.id,
					name: user.name,
					current: user.id === req.session.user,
				}
			}))

		})

	})

}

export default List
