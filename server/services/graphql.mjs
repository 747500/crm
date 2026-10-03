import util from 'util';

import Services from './index.mjs';

// Пунктирно реализованная reflection-обёртка:
// на старте спрашиваем у бэкенда поля Query (introspection) и
// отдаём наружу чистый прокси к amqp.graphql.
const querySchema = `{
  __schema {
    queryType {
      fields {
        name
      }
    }
  }
}`;

const service = {
  name: 'graphql',

  init() {
    return new Promise((resolve, reject) => {
      this.amqp.graphql(querySchema, (reply) => {
        if (reply.errors) {
          reject(reply.errors);
          return;
        }

        console.log(
          '* graphql schema reply:',
          util.inspect(reply, { depth: 5 }),
        );

        resolve(
          reply.data.__schema.queryType.fields.map((item) => item.name),
        );
      });
    }).then((fields) => {
      console.log('* schema fields:', fields);

      return (query, callback) => {
        return this.amqp.graphql(query, callback);
      };
    });
  },
};

export default service;
