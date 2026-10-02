
import { fieldsList } from 'graphql-fields-list'

import model from '../../model/index.mjs'
import { serializeUser } from '../serialize.mjs'

export function user ({ id }, context, info) {
	const fields = fieldsList(info, {
		transform: {
			version: '__v',
			id: '_id',
		}
	})

	const query = model.User.findOne({ _id: id }).select(fields)

	return query.exec().then(result => result ? serializeUser(result.toObject()) : null)
}
