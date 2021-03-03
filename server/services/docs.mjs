
import mongoose from 'mongoose'

import CONFIG from '../config.js'

const subsystem = {

	name: 'docs',

	init () {
		process.on('SIGTERM', () => {
			mongoose.disconnect()
			console.log('MongoDB disconnected')
		})

		return mongoose.connect(
			CONFIG.MongoDB.URI,
			CONFIG.MongoDB.options
		)
	}

}

export default subsystem
