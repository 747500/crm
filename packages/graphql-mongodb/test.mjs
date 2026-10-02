
import util from 'util'
//import { IntrospectionQuery, buildClientSchema } from 'graphql/utilities'
import { graphql, getIntrospectionQuery, buildClientSchema } from 'graphql'

import amqplib from 'amqplib'
import CONFIG from './config.mjs'

amqplib.connect(CONFIG.RabbitMQ.url)
.then(connection => {

	/*
	const query = {
		model: 'User',
		method: 'findOne',
		args: [
			{
				_id: '603d231a9a7451fe5bbc49b7'
			}
		]
	}
	*/
		// 601cbe60139b35accc3d039f

	const query = [
		getIntrospectionQuery(),

/*
`
{ doc(id: "600f186fb11e3e5eae96e9df") {
	__typename
	... on Person {
		id
		ctime
		mtime
		version
		person {
			firstName lastName middleName comments
			contact { _id data description }
		}
	}
	... on Property {
		id
		ctime
		mtime
		version
		owner
		mainPicture
		property { address price description }
	}
}}
`,
*/

		/*
		`{ user(id: "603d231a9a7451fe5bbc49b7") {
			id
			name
			notifyBirthdayAt
			notifyTelegramId
			ctime
			mtime
			version
		} }`,
		*/

		/*
		`{ users(notified: true) {
			id
			mtime
			notifyTelegramId
			notifyBirthdayAt
		} }`
		*/
	]

	return connection.createChannel().then(channel => {

		return channel.assertQueue('', { exclusive: true }).then(q => {

			return [

				channel.consume(
					q.queue,
					message => {
						const { content, ...header } = message

						const result = JSON.parse(content)
						//console.log(header)
						//console.dir(result.data || result.errors, { depth: 7 })

						const schema = buildClientSchema(result.data)

						graphql(
							schema,
							'{ __schema { queryType { fields { name } } } }',
							{}
						)
						.then(result => {
							console.log(util.inspect(result.data || result.errors, { depth: 5 }))

							function graphqlProxyMethod () {}

							const resolversRoot = result.data.__schema.queryType.fields
									.map(field => field.name)
									.reduce(
										(accum, item) => {
											accum[item] = graphqlProxyMethod
											return accum
										},
										{}
									)

							console.log(resolversRoot)
						})
						.catch(err => console.error(err))


						return

						//connection.close()

					},
					{
						noAck: true
					}
				),

				...query.map(query => channel.sendToQueue(
						CONFIG.RabbitMQ.queues['graphql'].name,
						Buffer.from(query),
						{
							contentType: 'text/plain',
							contentEncoding: 'utf8',
							timestamp: Date.now(),
							replyTo: q.queue,
							correlationId: Date.now().toString(),
						}
					),

				)

			].reduce((accum, ok) => accum.then(ok), Promise.resolve())

		})
	})

})
.catch(err => {
	console.error('fatal:', err)
	process.exit(1)
})
