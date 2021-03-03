
import moment from 'moment'
import mongoose from 'mongoose'

import { Doc } from '../../model/index.mjs'

const Events = (req, res, next) => {
	const userId = mongoose.Types.ObjectId(req.session.user)
	console.log('* mw.doc.Events\n', req.query)

	const month = parseInt(moment(req.query.yearmonth).format('MM'))
	console.log('* mw.doc.Events month:', month)

	Doc.aggregate([
		{
			$project: {
				_id: true,
				kind: true,
				user: true,
				firstName: '$person.firstName',
				middleName: '$person.middleName',
				lastName: '$person.lastName',
				birthDay: '$person.birthDay',
				month: {
					$month: '$person.birthDay'
				}
			}
		},
		{
			$match: {
				user: userId,
				kind: 'person',
				month: month
			}
		}
	])
	.then(result => {
		console.log('* mw.doc.Events\n', result)

		res.locals.Result = result.map(i => {

			const birthDate = moment(i.birthDay).format('DD-MM-YYYY')
			const day = moment(i.birthDay).format('DD')
			const eventDate = `${req.query.yearmonth}-${day}`
			const age = 1 + moment(eventDate).diff(i.birthDay, 'years');

			return {
				eventAt: eventDate,
				eventTitle: `ДР - ${age}`,
				subjectId: i._id.toString(),
			}
		})
		next()
	})
	.catch(next)
}

export default Events
