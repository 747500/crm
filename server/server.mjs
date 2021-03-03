'use strict'

import express from 'express'

import apiRouter from './routes/index.mjs'

import ServicesRun from './services/index.mjs'


ServicesRun.then(services => {

	services.web.use(express.static('public'))
	services.web.use('/', apiRouter)

}).catch(err => {
	console.error('FATAL:', err)
	process.kill(process.pid, 'SIGTERM')
})
