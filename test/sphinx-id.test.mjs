import { describe, it, expect } from 'vitest'

import { sphinxId } from '../server/lib/sphinx-id.mjs'

const oid = hex => ({ _id: { toString: () => hex } })

describe('sphinxId', () => {
	it('число и уникально для разных ObjectId', () => {
		const a = sphinxId(oid('603d231a9a7451fe5bbc49b7'))
		const b = sphinxId(oid('603d231a9a7451fe5bbc49b8'))
		expect(typeof a).toBe('number')
		expect(a).not.toBe(b)
	})

	it('разные документы с одинаковым префиксом (одна мс) не коллизят — регресс B8', () => {
		const a = sphinxId(oid('603d231a9a7451fe5bbc0001'))
		const b = sphinxId(oid('603d231a9a7451fe5bbc0002'))
		expect(a).not.toBe(b)
	})

	it('стабильно для одного и того же id', () => {
		const h = '603d231a9a7451fe5bbc49b7'
		expect(sphinxId(oid(h))).toBe(sphinxId(oid(h)))
	})
})
