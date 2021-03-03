

import Sphinx from './sphinx.mjs'
import Docs from './docs.mjs'
import Files from './files.mjs'
import Web from './web.mjs'
import Events from './events.mjs'

const Services = [
	Sphinx,
	Docs,
	Web,
	Files,
	Events,
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
