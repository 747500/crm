

import amqp from './amqp/index.mjs'
import telegram from './telegram.mjs'

const Services = [
	amqp,
	telegram,
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
