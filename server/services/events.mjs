
import CONFIG from '../config.js'

import Services from './index.mjs'

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
