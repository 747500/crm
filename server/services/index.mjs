

import rabbitmq from './rabbitmq.mjs'
import sphinx from './sphinx.mjs'
import mongodb from './mongodb.mjs'
import gridfs from './gridfs.mjs'
import express from './express.mjs'
import events from './events.mjs'
import graphql from './graphql.mjs'

const Services = [
	rabbitmq,
	sphinx,
	mongodb,
	gridfs,
	events,
	express,
	graphql,
]

function run (service) {

	console.log(`sss init "${service.name}"`)

	return service.init.bind(this)().then(
		result => {
			console.log('\tok')
			service.endpoint = result
			return result
		}
	)
}

function init () {
	const s = {}

	return Services.reduce(
		(ok, service) => ok.then(
			() => run.bind(s)(service).then(() => {
				return s[service.name] = service.endpoint
			})
		),
		Promise.resolve()
	)
	.then(() => {
		console.log('* Services started:', Object.keys(s))
		return s;
	})
}

const ok = init() // promise-singleton

export default {
	Run () {
		return ok
	}
}
