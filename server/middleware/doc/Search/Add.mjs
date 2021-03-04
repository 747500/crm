
import mongoose from 'mongoose'

import Services from '../../../services/index.mjs'

import CONFIG from '../../../config.js'


const docSearchAdd = (req, res, next) => {
	const doc = res.locals.Doc
	const id = doc.ctime.getTime()
	const docFts = doc.fts

	console.log('* mw.doc.Search.Add:', docFts)

	Services.Run()
	.then(service => {

		services.sphinxql.query(
			`INSERT INTO ${CONFIG.SphinxQL.indexName}` +
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

				console.log('* mw.doc.Search.Add:', row)

				next()

			}
		)

	})
	.catch(next)
}

export default docSearchAdd
