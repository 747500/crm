'use strict'

import moment from 'moment'

import express from 'express'
import morgan from 'morgan'
//import bodyParser from 'body-parser'

import mongodb from 'mongodb'
import mongoose from 'mongoose'


const app = express()
const port = 3000
app.use(morgan('dev'))
app.use(express.json())


const docSchemaOptions = {
	discriminatorKey: 'kind'
}

const docSchema = new mongoose.Schema(
	{
		time: Date
	},
	docSchemaOptions
);

const Doc = mongoose.model('Doc', docSchema)

const Person = Doc.discriminator(
	'person',
	new mongoose.Schema(
		{
			firstName: String,
			lastName: String,
			middleName: String,
			birthDay: Date,
			passport: String,
			files: [ mongoose.Types.ObjectId ]
		},
		docSchemaOptions
	)
)

const Property = Doc.discriminator(
	'property',
	new mongoose.Schema(
		{
			address: String,
			description: String,
			files: [ mongoose.Types.ObjectId ]
		},
		docSchemaOptions
	)
)

mongoose.connect(
	'mongodb://127.0.0.1:27017/crm',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
).then((result)=> {
	const db = result.connection

	console.log('DB connected')

	// TODO validation
	app.get('/person', (req, res, next) => {

		Person.find().then(result => {
			res.send(result)
		}).catch(next)

	})

	// TODO validation
	app.get('/person/events', (req, res, next) => {

		console.log(req.query)

		const month = parseInt(moment(req.query.yearmonth).format('MM'))

		Person.aggregate(
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
						month: month
					}
				}
			]
		).then(result => {
			res.send(result.map(i => {

				const birthDate = moment(i.birthDay).format('DD-MM-YYYY')
				const day = moment(i.birthDay).format('DD')
				const eventDate = `${req.query.yearmonth}-${day}`
				const age = 1 + moment(eventDate).diff(i.birthDay, 'years');

				return {
					eventAt: eventDate,
					eventTitle: `${birthDate} ${i.lastName} ${i.firstName} ${i.middleName} ${age}`
				}
			}))
		}).catch(next)
	})

	// TODO validation
	app.get('/person/:id', (req, res,next) => {

		Person.findById(req.params.id).then(result => {
			console.log('findById:', result)
			res.send(result.toObject())
		}).catch(next)

	})

	// TODO validation
	app.post('/person', (req, res, next) => {

		Person.findByIdAndUpdate(req.body._id, req.body).then(result => {
			console.log('findByIdAndUpdate:', result)
			res.send(result.toObject())
		}).catch(next)

	})

	// TODO validation
	app.put('/person', (req, res, next) => {

		delete req.body._id

		const person = new Person(req.body)

		person.save().then(result => {
			res.send(result.toObject())
		}).catch(next)
	})


	//app.post('/person/:id/upload', upload.array('photos', 12), function (req, res, next) {
	  // req.files is array of `photos` files
	  // req.body will contain the text fields, if there were any
	//})

	app.use(express.static('public'))

	app.listen(port, () => {
	  console.log(`Example app listening at http://localhost:${port}`)
	})


}).catch(err => {
	console.error(err)
})
