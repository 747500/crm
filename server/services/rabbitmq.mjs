
import amqp from 'amqplib'

import CONFIG from '../config.js'

const service = {

	name: 'amqp',

	init () {
		return amqp.connect(CONFIG.AMQP.url)
			.then(conn => {
				console.log(`RabbitMQ connected at ${CONFIG.AMQP.url}`)
				return conn
			})

	}
}

export default service
