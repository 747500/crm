
import express from 'express'

import api from './routes/index.mjs'

import Services from './services/index.mjs'


Services.Run()
.then(services => {

	services.express.use(express.static('public'))
	services.express.use('/api/v0', api)

	services.amqp.onBotAuth((req, next) => {
		services.mongodb.authTelegramBot(req.cookie, req.telegramId, next)
	})

})
.catch(err => {
	console.error('FATAL:', err)
	process.kill(process.pid, 'SIGTERM')
	setTimeout(() => process.kill(process.pid, 'SIGKILL'), 3000)
})
