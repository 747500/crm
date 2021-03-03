

import mongoose from 'mongoose'


const docList = (req, res, next) => {
	const userId = mongoose.Types.ObjectId(req.session.user)

	var ok = res.locals.Schema.find(
		{
			user: userId
		}
	)

	switch (res.locals.kind) {

		case 'person':
			ok = ok.sort({
				'person.lastName': 1,
				'person.firstName': 1,
				'person.middleName': 1,
			})
			break;

		case 'property':
			ok = ok.sort({
				'mtime': -1,
			})
			break;

	}

	ok.then(
		result => {
			res.locals.Result = result
			next()
		}
	)
	.catch(next)

}

export default docList
