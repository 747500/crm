
import { fieldsList } from 'graphql-fields-list'

import { Doc } from '../../model/index.ts'
import { serializeDoc } from '../serialize.ts'

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
