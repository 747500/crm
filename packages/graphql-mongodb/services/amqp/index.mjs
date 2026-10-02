
import amqp from 'amqplib'

import CONFIG from '../../config.mjs'

// -------------------------------------------------------------------------

function AMQPService (connection) {
	this.connection = connection
}

AMQPService.prototype.replyOn = function (message, data) {

	//console.log('* AMQPService.replyOn:', telegramId, cookie)

	return this.connection.createChannel()
		.then(channel => {
			return channel.sendToQueue(
				message.properties.replyTo,
				Buffer.from(data),
				{
					contentType: 'application/json',
					contentEncoding: 'utf8',
					persistent: true,
					correlationId: message.properties.correlationId,
					timestamp: Date.now(),
				}
			)
		})
}

AMQPService.prototype.onMessage = function (qName, callback) {

	const queue = CONFIG.RabbitMQ.queues[qName]

	return this.connection.createChannel()
	.then(channel => {
		channel.prefetch(1)

		return channel.assertQueue(
			queue.name,
			queue.properties,
		)
		.then(() => {
			return channel.consume(
				queue.name,
				message => callback(
					message,
					err => {
						if (err) {
							console.error('! AMQPService.onMessage', err)
							return
						}
						channel.ack(message)
					}
				)
			)
		})
	})

}

// -------------------------------------------------------------------------

export default {

	name: 'amqp',

	init () {
		return amqp.connect(CONFIG.RabbitMQ.url)
		.then(connection => {
			console.log(`\tRabbitMQ connected at ${CONFIG.RabbitMQ.url}`)
			return new AMQPService(connection)
		})
	}
}
