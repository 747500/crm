
import mongoose from 'mongoose'
import express from 'express'
import session from 'express-session'
import morgan from 'morgan'

morgan.token('session', req => {
	return `${req.sessionID}`
})

morgan.token('user', req => {
	const haveUser =
		'object' === typeof req.User

	if (haveUser) {
		return req.User.name
	}

	const haveSession =
		'object' === typeof req.session && req.session.user

	if (haveSession) {
		return req.session.user
	}

	return '-'
})

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

// https://github.com/jdesboeufs/connect-mongo
import MongoStore from 'connect-mongo'

import CONFIG from '../config.js'


const service = {

	name: 'express',

	init () {
		return new Promise((resolve, reject) => {
			const app = express()
			const port = CONFIG.Express.port
			app.use(cookieParser(CONFIG.Express.Session.secret))
			//app.use(morgan('dev'))
			app.use(morgan('[:session :user] :method :url :status :response-time ms - :res[content-length]'))
			app.use(bodyParser.text())
			app.use(express.json())
			app.use(bodyParser.json())

			const sessionStore = MongoStore.create({
				mongoUrl: CONFIG.MongoDB.URI,
				collectionName: 'sessions',
				//touchAfter: 600,
				//crypto: {
				//	secret: 'blah'
				//},
				stringify: false,
			})

			/*
			sessionStore.on('create', (... args) => console.log('* Session create', args))
			sessionStore.on('touch', (... args) => console.log('* Session touch', args))
			sessionStore.on('update', (... args) => console.log('* Session update', args))
			sessionStore.on('set', (... args) => console.log('* Session set', args))
			sessionStore.on('destroy', (... args) => console.log('* Session destroy', args))
			*/

			app.set('trust proxy', 1) // trust first proxy
			app.use(session({
				secret: CONFIG.Express.Session.secret,
				resave: true,
				saveUninitialized: true,
				cookie: {
					secure: false,
					maxAge: CONFIG.Express.Session.maxAge
				},
				genid: () => mongoose.Types.ObjectId().toString(),
				store: sessionStore,
				//unset: // 'keep' | 'destroy'
			}))

			app.use((req, res, next) => {
				if (req.session.ip !== req.ip){
					req.session.ip = req.ip
				}
				next()
			})

			const server = app.listen(port, () => {
				resolve(app)
				console.log(`\tlistening at http://localhost:${port}`)

				process.on('SIGTERM', () => {
					server.close(() => {
						console.log('Express terminated')
					})
				})
			})
			.on('error', reject)

		})
	}
}

export default service
