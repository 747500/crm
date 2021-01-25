'use strict'

import moment from 'moment'

import express from 'express'
import morgan from 'morgan'

//import bodyParser from 'body-parser'
import mongodb from 'mongodb'



const app = express()
const port = 3000
app.use(morgan('dev'))
app.use(express.json())



const uri = "mongodb://127.0.0.1:27017?retryWrites=true&writeConcern=majority"

mongodb.MongoClient.connect(
	uri,
	{
		useUnifiedTopology: true
	}
).then((connection) => {
	return connection.db('crm')
}).then((db) => {

	console.log('DB connected')

	/*
	app.get('/', (req, res) => {
	  res.send('Hello World!')
	})
	*/

	// TODO validation
	app.get('/calendar/events', (req, res, next) => {
		/*
		res.send([
			{
				name: 'test',
				start: '2020-04-05 10:00:00',
				end: '2020-04-05 11:30:00',
				color: 'cyan',
			},
			{
				name: 'test',
				start: '2020-04-05 07:00:00',
				end: '2020-04-05 07:25:00',
				color: 'green',
			},
			{
				name: 'test',
				start: '2020-04-05 08:00:00',
				end: '2020-04-05 08:15:00',
				color: 'red',
			},
		])
		*/

		console.log(req.query)

		const mm = parseInt(moment(req.query.yearmonth).format('MM'))

		console.log('mm', mm)

		let cursor;

		cursor = db.collection('docs').aggregate(
			[
				{
					$project: {
						firstName: 1,
						middleName: 1,
						lastName: 1,
						birthDay: 1,
						month: {
							$month: '$birthDay'
						}
					}
				},
				{
					$match: {
						month: mm
					}
				}
			]
		)

		cursor.toArray().then((data) => {
			console.log(data)
			res.send(data.map((item) => {
				item.birthDay = moment(item.birthDay).format('YYYY-MM-DD')
				return item
			}))
		}).catch(next)
	})


	// TODO validation
	app.get('/person', (req, res, next) => {

		let cursor;

		cursor = db.collection('docs').find()

		cursor.toArray().then((data) => {
			res.send(data.map((item) => {
				item.birthDay = moment(item.birthDay).format('YYYY-MM-DD')
				return item
			}))
		}).catch(next)
	})


	// TODO validation
	app.get('/person/:id', (req, res,next) => {

		const o_id = mongodb.ObjectID(req.params.id)

		db.collection('docs').findOne(
			{
				_id: o_id
			}
		).then((item) => {
			console.log(item)
			item.birthDay = moment(item.birthDay).format('YYYY-MM-DD')
			res.send(item)
		}).catch(next)

	})

	// TODO validation
	app.post('/person', (req, res, next) => {

		const o_id = mongodb.ObjectID(req.body._id)

		delete req.body._id

		req.body.birthDay = new Date(req.body.birthDay)

		db.collection('docs').findOneAndUpdate(
			{
				_id: o_id
			},
			{
				$set: req.body
			}
		).then((data) => {
			console.log(data)
			res.send(data)
		}).catch(next)

	})

	// TODO validation
	app.put('/person', (req, res, next) => {

		console.log('PUT', req.body)

		delete req.body._id
		req.body.birthDay = new Date(req.body.birthDay)

		db.collection('docs').insertOne(req.body).then((result) => {
			req.body._id = result.insertedId
			res.send(req.body)
		}).catch(next)
	})

/*
	app.post('/person/:id/upload', upload.array('photos', 12), function (req, res, next) {
	  // req.files is array of `photos` files
	  // req.body will contain the text fields, if there were any
	})
*/

	app.use(express.static('public'))

	app.listen(port, () => {
	  console.log(`Example app listening at http://localhost:${port}`)
	})


}).catch((err) => {
	console.error(err)
})
