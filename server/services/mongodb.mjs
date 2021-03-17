
import mongoose from 'mongoose'

import { User } from '../model/index.mjs'

import CONFIG from '../config.js'

const service = {

	name: 'mongodb',

	init () {
		process.on('SIGTERM', () => {
			mongoose.disconnect()
			console.log('MongoDB disconnected')
		})

		return mongoose.connect(
			CONFIG.MongoDB.URI,
			CONFIG.MongoDB.options
		).then(mongodb => {

			return {
				connection: mongodb.connection,
				authTelegramBot (userId, telegramId, callback) {

					console.log('* onBotAuth:', userId, telegramId)

					User.findOne({
						_id: mongoose.Types.ObjectId(userId)
					})
					.then(user => {
						if (null === user) {
							throw new Error('User Not Found')
						}

						user.notifyTelegramId = telegramId

						return user.save()
					})
					.catch(err => callback(err))

					callback()
				}
			}
		})
	}

}

export default service
