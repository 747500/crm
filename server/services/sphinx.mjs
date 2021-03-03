

//import SphinxClient from 'sphinxapi'

import mysql from 'mysql'
import CONFIG from '../config.js'

const subsystem = {

	name: 'sphinxql',

	init () {
		return new Promise((resolve, reject) => {

			var pool = mysql.createPool({
				connectionLimit: 1,
				localAddress: CONFIG.SphinxQL.address,
				port: CONFIG.SphinxQL.port,
			})

			pool.on('error', err => reject(err))

			process.on('SIGTERM', () => {
				pool.end()
				console.log('Sphinx disconnected')
			})

			resolve(pool)
		})
	}
}

export default subsystem
