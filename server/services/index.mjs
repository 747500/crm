

import sphinx from './sphinx.mjs'
import mongodb from './mongodb.mjs'
import gridfs from './gridfs.mjs'
import express from './express.mjs'
import events from './events.mjs'

const Services = [
	sphinx,
	mongodb,
	gridfs,
	events,
	express,
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
	const sss = {}

	return Services.reduce(
		(ok, service) => ok.then(() => {
			return run.bind(sss)(service).then(() => {
				sss[service.name] = service.endpoint
			})
		}),
		Promise.resolve()
	)
	.then(result => {
		console.log('sss init ok:', Object.keys(sss))
		return sss;
	})
}

export default init() // promise-singleton
