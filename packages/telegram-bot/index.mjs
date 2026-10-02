
import * as logger from './logger/index.mjs'
import * as commands from './commands/index.mjs'

import Services from './services/index.mjs'

import CONFIG from './config.mjs'

Services.Run()
.then(services => {

	return [

		services.telegram.on('polling_error', logger.Errors('tg poll:')),
		services.telegram.on('message', logger.Messages),


		services.telegram.onText(/^\/start/, commands.Start),
		services.telegram.onText(/^\/auth\s+(\S+)/, commands.Auth),

		services.amqp.onMessage((message, next) => {
			console.log('* amqp onMessage callback:', message)

			services.telegram.sendMessage(
				message.to,
				message.text
			)
			.then(() => {
				next()
			})
			.catch(logger.Errors('amqp2tg:'))

		})

	].reduce((accum, next) => accum.then(next), Promise.resolve())

})
.catch(err => {
	logger.Errors('fatal:')(err)
	process.exit(1)
})
