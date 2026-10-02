
import { fieldsList } from 'graphql-fields-list'

import { Doc } from '../../model/index.ts'
import { serializeDoc } from '../serialize.ts'

export function docs (args, context, info) {
	const fields = fieldsList(info, {
		transform: {
			version: '__v',
			id: '_id',
		}
	})

	const query = Doc.find().select([ 'kind', ...fields ])

	return query.exec().then(results => results.map(r => serializeDoc(r.toObject())))
}
