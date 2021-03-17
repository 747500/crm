
import amqp from 'amqplib'

import CONFIG from '../config.js'

function AMQPService (channel) {
	this.channel = channel
}

AMQPService.prototype.onBotAuth = function (callback) {

	this.channel.prefetch(1)

	this.channel.consume(
		CONFIG.AMQP.authQueue.name,
		message => {

			callback(
				message,
				(err) => {
					var replyMessage = 'Ok'

					if (err) {
						replyMessage = 'Failed'
					}

					this.channel.ack(message)

					this.channel.sendToQueue(
						message.properties.replyTo,
						Buffer.from(replyMessage),
						{
							persistent: true,
							contentType: 'text/plain',
							correlationId: message.properties.correlationId,
						}
					)
				}
			)
		}
	)

}

const service = {

	name: 'amqp',

	init () {
		return amqp.connect(CONFIG.AMQP.url)
			.then(connection => {
				return connection.createChannel()
				.then(channel => {

					channel.assertQueue(
						CONFIG.AMQP.authQueue.name,
						CONFIG.AMQP.authQueue.properties,
					)

					console.log(`\tRabbitMQ connected at ${CONFIG.AMQP.url}`)

					return new AMQPService(channel)
				})
			})

	}
}

export default service
