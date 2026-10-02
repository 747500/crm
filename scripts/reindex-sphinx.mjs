
// Реиндексация документов CRM в Sphinx RT-индекс.
// Запуск: node --env-file-if-exists=.env scripts/reindex-sphinx.mjs
import mongoose from 'mongoose'
import mysql from 'mysql'

import { Doc } from '../server/model/index.mjs'
import CONFIG from '../server/config.js'

const index = CONFIG.SphinxQL.indexName

async function main () {
	await mongoose.connect(CONFIG.MongoDB.URI, CONFIG.MongoDB.options)

	const pool = mysql.createPool({
		connectionLimit: 1,
		host: CONFIG.SphinxQL.address,
		port: CONFIG.SphinxQL.port,
	})

	const query = (sql, args) => new Promise((resolve, reject) => {
		pool.query(sql, args, (err, rows) => err ? reject(err) : resolve(rows))
	})

	// RT-индекс допускает DELETE по диапазону
	await query(`DELETE FROM ${index} WHERE id > 0`)

	const docs = await Doc.find({})
	console.log('* reindex:', docs.length, 'docs')

	for (const doc of docs) {
		const id = doc.ctime.getTime()
		const content = doc.fts.join(' ')

		await query(
			`REPLACE INTO ${index} (id, content, user, oid, kind) VALUES (?, ?, ?, ?, ?)`,
			[ id, content, doc.user.toString(), doc._id.toString(), doc.kind ]
		)
	}

	pool.end()
	await mongoose.disconnect()

	console.log('* reindex done ->', index)
}

main().catch(err => {
	console.error('reindex FATAL:', err)
	process.exit(1)
})
