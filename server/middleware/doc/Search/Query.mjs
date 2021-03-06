
import mongoose from 'mongoose'

import Services from '../../../services/index.mjs'

import CONFIG from '../../../config.js'

const docSearchQuery = (req, res, next) => {

	const userId = mongoose.Types.ObjectId(req.session.user)

	console.log('* mw.doc.Search.Query:', req.body)

	const searchString = req.body.q

	const queryArgs = []
	var query = 'SELECT *' +
		` FROM ${CONFIG.SphinxQL.indexName}` +
		' WHERE user = ? AND MATCH(?)'

	queryArgs.push(userId.toString())
	queryArgs.push(req.body.q)

	if (req.body.kind) {
		let n = queryArgs.length

		if ((req.body.kind instanceof Array) && req.body.kind.length) {
			queryArgs.push(req.body.kind)
		}
		else
		if ('string' === typeof req.body.kind) {
			queryArgs.push(req.body.kind)
		}

		if (queryArgs.length !== n) {
			query += ' AND kind IN (?)'
		}
	}

	console.log('* mw.doc.Search.Query:', {
		q: query,
		a: queryArgs
	})

	Services.Run()
	.then(services => {

		if (undefined === services.sphinxql) {
			throw new Error('"sphinxql" service is not available')
		}

		return services
	})
	.then(services => {

		services.sphinxql.query(
			query, queryArgs,
			(err, rows, fields) => {

				if (err) {
					next(err)
					return
				}

				console.log('* mw.doc.Search.Query SELECT rows:', rows.length)

				services.sphinxql.query(
					'SHOW META LIKE ?',
					[ 'total_found' ],
					(err, meta, fields) => {

						if (err) {
							console.error(err)
							return
						}

						console.log('* mw.doc.Search.Query total_found:', meta[0].Value)

						res.send({
							total_found: meta[0].Value,
							result: rows
						})
					}
				)
			}
		)
	})
	.catch(next)

}

export default docSearchQuery
