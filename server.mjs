'use strict'

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
	app.get('/person', (req, res, next) => {

		let cursor;

		cursor = db.collection('docs').find()

		cursor.count().then((result) => {
			return cursor.toArray()
		}).then((data) => {
			res.send(data)
		}).catch(next)
	})


	// TODO validation
	app.get('/person/:id', (req, res,next) => {

		const o_id = mongodb.ObjectID(req.params.id)

		db.collection('docs').findOne(
			{
				_id: o_id
			}
		).then((data) => {
			console.log(data)
			res.send(data)
		}).catch(next)

	})

	// TODO validation
	app.post('/person', (req, res, next) => {

		const o_id = mongodb.ObjectID(req.body._id)

		delete req.body._id

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

		db.collection('docs').insertOne(req.body).then((result) => {
			req.body._id = result.insertedId
			res.send(req.body)
		}).catch(next)
	})

	app.use(express.static('public'))

	app.listen(port, () => {
	  console.log(`Example app listening at http://localhost:${port}`)
	})


}).catch((err) => {
	console.error(err)
})
