import { graphql, buildSchema } from 'graphql';

import schemaText from './schema.ts';
import * as resolvers from './resolvers/index.ts';

const schema = buildSchema(schemaText);

export default function (query) {
  return graphql(schema, query, resolvers);
}
