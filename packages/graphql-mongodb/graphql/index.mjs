
import { graphql, buildSchema } from 'graphql'

import schemaText from './schema.mjs'
import * as resolvers from './resolvers/index.mjs'

const schema = buildSchema(schemaText)

export default function (query) {
	return graphql(
		schema,
		query,
		resolvers
	)
}
