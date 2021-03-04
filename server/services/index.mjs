

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

function start () {
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

export default { start }
