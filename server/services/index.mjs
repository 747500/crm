

import Sphinx from './sphinx.mjs'
import Docs from './docs.mjs'
import Files from './files.mjs'
import Web from './web.mjs'
import Events from './events.mjs'

const SubSystems = [
	Sphinx,
	Docs,
	Web,
	Files,
	Events,
]

function runService (service) {

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

	return SubSystems.reduce(
		(ok, s) => ok.then(() => {
			return runService.bind(sss)(s).then(() => {
				sss[s.name] = s.endpoint
			})
		}),
		Promise.resolve()
	)
	.then(result => {
		console.log('sss init ok:', Object.keys(sss))
		return sss;
	})
}

export default init()
