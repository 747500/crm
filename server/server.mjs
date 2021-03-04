
import express from 'express'

import api from './routes/index.mjs'

import ServicesRun from './services/index.mjs'


ServicesRun.then(services => {

	services.express.use(express.static('public'))
	services.express.use('/api/v0', api)

})
.catch(err => {
	console.error('FATAL:', err)
	process.kill(process.pid, 'SIGTERM')
	setTimeout(() => process.kill(process.pid, 'SIGKILL'), 3000)
})
