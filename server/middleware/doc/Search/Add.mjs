import mongoose from 'mongoose';

import Services from '../../../services/index.mjs';

import CONFIG from '../../../config.js';

import { sphinxId } from '../../../lib/sphinx-id.mjs';

const docSearchAdd = (req, res, next) => {
  const doc = res.locals.Doc;
  const id = sphinxId(doc);
  const docFts = doc.fts;

  console.log('* mw.doc.Search.Add:', docFts);

  Services.Run()
    .then((services) => {
      if (undefined === services.sphinxql) {
        // NON-FATAL in this middleware
        next();
        return;
      }

      services.sphinxql.query(
        `INSERT INTO ${CONFIG.SphinxQL.indexName}` +
          ' (id, content, user, oid, kind)' +
          ' VALUES (?, ?, ?, ?, ?)',
        [
          id,
          docFts.join(' '),
          doc.user.toString(),
          doc._id.toString(),
          doc.kind,
        ],
        (err, row, fields) => {
          if (err) {
            console.error('* sphinx index skipped (non-fatal):', err.message);
            next();
            return;
          }

          console.log('* mw.doc.Search.Add:', row);

          next();
        },
      );
    })
    .catch(next);
};

export default docSearchAdd;
