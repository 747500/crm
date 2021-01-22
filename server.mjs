'use strict'

import express from 'express'
import morgan from 'morgan'
//import bodyParser from 'body-parser'

const app = express()
const port = 3000

app.use(morgan('combined'))
app.use(express.json())

/*
app.get('/', (req, res) => {
  res.send('Hello World!')
})
*/

app.get('/person/:id', (req, res) => {
	res.send({
		personId: '1',
		lastName: 'Иванов',
		firstName: 'Иван',
		middleName: 'Иванович',
		birthDay: '2001-02-03',
		passport: 'имеется'
	})
})

app.post('/person', (req, res) => {
	console.log('POST', req.body);
	res.send({ status: 'ok' })
})

app.put('/person', (req, res) => {
	console.log('PUT', req.body);
	res.send({ status: 'ok' })
})

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
