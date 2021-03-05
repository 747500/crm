
import mongoose from 'mongoose'

import Services from '../../../services/index.mjs'

import CONFIG from '../../../config.js'


const docSearchUpdate = (req, res, next) => {
	const doc = res.locals.Doc
	const id = doc.ctime.getTime()
	const docFts = doc.fts

	console.log(
		'* mw.doc.Search.Update:',
		{
			user: doc.user,
			_id: doc._id,
			kind: doc.kind,
			fts: docFts,
			sphinxId: id,
		}
	)

	Services.Run()
	.then(services => {

		if (undefined === services.sphinxql) {
			// NON-FATAL in this middleware
			next()
			return
		}

		services.sphinxql.query(
			`DELETE FROM ${CONFIG.SphinxQL.indexName} WHERE oid = ?`,
			[
				doc._id.toString()
			],
			(err, row, fields) => {
				if (err) {
					next(err)
					return
				}

				console.log('* mw.doc.Search.Update deleted:', row.affectedRows)

				services.sphinxql.query(
					`REPLACE INTO ${CONFIG.SphinxQL.indexName}`+
					' (id, content, user, oid, kind)' +
					' VALUES (?, ?, ?, ?, ?)',
					[
						id,
						docFts.join(' '),
						doc.user.toString(),
						doc._id.toString(),
						doc.kind
					],
					(err, row, fields) => {
						if (err) {
							next(err)
							return
						}

						console.log('* mw.doc.Search.Update replaced:', row.affectedRows)

						next()

					}
				)

			}
		)

	})
	.catch(next)

}

export default docSearchUpdate
