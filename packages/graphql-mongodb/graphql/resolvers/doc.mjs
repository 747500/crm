
import { fieldsList } from 'graphql-fields-list'

import { Doc } from '../../model/index.mjs'
import { serializeDoc } from '../serialize.mjs'

function doc ({ id }, context, info) {
	const fields = fieldsList(info, {
		transform: {
			version: '__v',
			id: '_id',
			__typename: 'kind',
		}
	})

	const query = Doc.findOne({ _id: id }).select(fields)

	return query.exec().then(result => result ? serializeDoc(result.toObject()) : null)
}

export {
	doc,
}
