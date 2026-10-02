
import graphql from './graphql/index.mjs'
import Services from './services/index.mjs'

Services.Run()
.then(services => {

	return [

		services.amqp.onMessage('graphql',
			(message, ack) => {
				const { content, ...header } = message
				const query = content.toString().replace(/\s+/g, ' ')

				console.log('* graphql query:', query)

				graphql(query).then(result => {

					console.log('* graphql result:', result.data || result.errors)

					return services.amqp.replyOn(
						message,
						JSON.stringify(result)
					)

				})
				.catch(err => {
					console.error('! error:', err)
				})
				.finally(() => {
					ack()
				})

			}
		),

		services.amqp.onMessage('query',
			(message, ack) => {

				//console.log('*', message)

				services.mongodb.query(
					JSON.parse(message.content)
				)
				.then(result => {

					//console.log(result)

					return services.amqp.replyOn(
						message,
						JSON.stringify(result)
					)
				})
				.catch(err => {
					console.error(err)
				})
				.finally(() => {
					ack()
				})

			}
		),

	].reduce((accum, next) => accum.then(next), Promise.resolve())



})
.catch(err => {
	console.error('FATAL:', err)
	process.kill(process.pid, 'SIGTERM')
	setTimeout(() => process.kill(process.pid, 'SIGKILL'), 3000)
})
