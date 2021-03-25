
import util from 'util'

import moment from 'moment'

import CONFIG from '../config.js'

import Services from './index.mjs'

const queryUsers = `{
	users(notified: true) {
		id
		mtime
		notifyTelegramId
		notifyBirthdayAt
	}
}`

const Users = {}

process.nextTick(() => {

	Services.Run().then(services => {

		return services.amqp.graphql(queryUsers, reply => {

			console.log('* graphql reply:', util.inspect(reply, { depth: 5 }))

		})

	})
	.catch(err => console.error)

})


setInterval(() => {

	Services.Run().then(services => {

		// services.mongodb.Users.List().then()

		const ts = new Date()
		console.log('! events check @ ', ts)

	})

}, 1000 * 60)

const service = {

	name: 'events',

	init () {
		// no-op
		return Promise.resolve()
	},
}

export default service
