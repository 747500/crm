
import amqp from 'amqplib'
import mongoose from 'mongoose'

import CONFIG from '../config.js'


function AMQPService ({ connection, channel }) {
	this.connection = connection
	this.channel = channel

	this.graphqlCorrelation = {}

	this.graphqlEndpoint = connection.createChannel().then(channel => {
		channel.prefetch(1)
		return channel.assertQueue(
			'',
			{
				exclusive: true
			}
		)
		.then(q => {

			return channel.consume(
				q.queue,
				message => {
					const { content, ...header } = message

					console.log('* consumed header', header)
					//console.dir(result, { depth: 3 })

					try {
						const correlationId = header.properties.correlationId

						if (!correlationId) {
							throw new Error(`Bad correlationId: '${correlationId}'`)
						}

						const item = this.graphqlCorrelation[correlationId]

						if (!item) {
							throw new Error(`correlationId ' ${correlationId}' is not found`)
						}

						delete this.graphqlCorrelation[correlationId]

						const result = JSON.parse(content)

						item.callback(result)

					}
					catch (ex) {
						console.error('* message error:\n', ex)
					}

				},
				{
					noAck: true
				}
			)
			.then(() => {
				return {
					channel,
					queue: q.queue
				}
			})
		})
	})

}

AMQPService.prototype = {

	graphql (query, callback) {

		query = query.replace(/\s+/g, ' ')
		query = query.replace(/^\s+/, '')
		query = query.replace(/\s+$/, '')

		const item = {
			ts: new Date(),
			query,
			callback,
		}

		const correlationId = mongoose.Types.ObjectId().toString()

		console.log('* new correlationId:', correlationId)

		return this.graphqlEndpoint.then(ep => {

			ep.channel.sendToQueue(
				CONFIG.AMQP.queues['graphql'].name,
				Buffer.from(query),
				{
					contentType: 'text/plain',
					contentEncoding: 'utf8',
					timestamp: Date.now(),
					replyTo: ep.queue,
					correlationId: correlationId,
				}
			)

			this.graphqlCorrelation[correlationId] = item

		})
	},

 	onBotAuth (callback) {

		this.channel.prefetch(1)

		this.channel.consume(
			CONFIG.AMQP.authQueue.name,
			message => {

				callback(
					message,
					(err) => {
						var replyMessage = 'Ok'

						if (err) {
							console.error('! onBotAuth:', err)
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
	},


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

					return new AMQPService({ connection, channel })
				})
			})

	}
}

export default service
