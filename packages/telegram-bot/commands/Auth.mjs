

import Services from '../services/index.mjs'

function Auth (message, match) {

	Services.Run()
	.then(services => {

		services.amqp.auth(message.from.id, match[1])

	})

}


export {
	Auth,
}
