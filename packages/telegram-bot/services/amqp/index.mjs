
import amqp from 'amqplib'

import CONFIG from '../../config.mjs'

// -------------------------------------------------------------------------

function AMQPService (channel) {
	this.channel = channel
}

AMQPService.prototype.auth = function (telegramId, cookie) {

	console.log('* AMQPService.auth:', telegramId, cookie)

	return this.channel.sendToQueue(
		CONFIG.amqp.authQueue,
		Buffer.from(cookie.toString()),
		{
			persistent: true,
			correlationId: telegramId.toString(),
			contentType: 'text/plain',
			replyTo: CONFIG.amqp.botQueue.name,
		}
	)

}

AMQPService.prototype.onMessage = function (callback) {

	this.channel.prefetch(1)

	this.channel.consume(
		CONFIG.amqp.botQueue.name,
		message => {

			console.log('* AMQPService.onMessage consumed:', message)

			callback(
				{
					to: message.properties.correlationId.toString(),
					text: message.content.toString(),
				},
				() => {
					this.channel.ack(message)
				}
			)
		}
	)
}

// -------------------------------------------------------------------------

export default {

	name: 'amqp',

	init () {
		return amqp
			.connect(CONFIG.amqp.url)
			.then(connection => {
				return connection.createChannel()
				.then(channel => {

					channel.assertQueue(
						CONFIG.amqp.botQueue.name,
						CONFIG.amqp.botQueue.properties,
					)

					console.log(`\tRabbitMQ connected at ${CONFIG.amqp.url}`)

					return new AMQPService(channel)
				})
			})
	}
}
