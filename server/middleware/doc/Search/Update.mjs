
import mongoose from 'mongoose'

import ServicesRun from '../../../services/index.mjs'

import CONFIG from '../../../config.js'


const docSearchUpdate = (req, res, next) => {
	const doc = res.locals.Doc
	const id = doc.ctime.getTime()
	const docFts = doc.fts

	console.log(
		'* fulltextUpdate:',
		{
			user: doc.user,
			_id: doc._id,
			kind: doc.kind,
			fts: docFts,
			sphinxId: id,
		}
	)

	ServicesRun.then(services =>{

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

				console.log('* docSearchUpdate deleted:', row.affectedRows)

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

						console.log('* docSearchUpdate replaced:', row.affectedRows)

						next()

					}
				)

			}
		)

	})

}

export default docSearchUpdate
