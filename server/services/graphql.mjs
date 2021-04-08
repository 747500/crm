
import util from 'util'

import moment from 'moment'
import graphql from 'graphql'

import CONFIG from '../config.js'

import Services from './index.mjs'

const querySchema = `{
  __schema {
    queryType {
      fields {
        name
      }
    }
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

const service = {

	name: 'graphql',

	init () {

		return new Promise((resolve, reject) => {
			this.amqp.graphql(querySchema, reply => {

				if (reply.errors) {
					reject(errors)
					return
				}

				console.log(reply)

				resolve(
					reply.data.__schema.queryType.fields.map(item => {
						return item.name
					})
				)

			})
		})
		.then(fields => {

			console.log('* schema fields:', fields)

			return (query, callback) => {
				return this.amqp.graphql(queryUsers, callback)
			}

		})


	},
}

export default service
