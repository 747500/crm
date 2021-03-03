
import express from 'express'

import api from './routes/index.mjs'

import ServicesRun from './services/index.mjs'


ServicesRun.then(services => {

	services.web.use(express.static('public'))
	services.web.use('/api/v0', api)

}).catch(err => {
	console.error('FATAL:', err)
	process.kill(process.pid, 'SIGTERM')
})
