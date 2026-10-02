import { describe, it, expect } from 'vitest'

import fts from '../server/model/virtuals/fts.mjs'

const run = doc => fts.call({ _doc: doc })

describe('fts virtual', () => {
	it('собирает строки из вложенного объекта', () => {
		const out = run({ kind: 'person', person: { firstName: 'Иван', lastName: 'Иванов' } })
		expect(out).toContain('Иван')
		expect(out).toContain('Иванов')
	})

	it('включает массивы (contact[]) — регресс B9', () => {
		const out = run({
			kind: 'person',
			person: { contact: [ { data: 'qq@chto.li', description: 'рабочий' } ] },
		})
		expect(out).toContain('qq@chto.li')
		expect(out).toContain('рабочий')
	})

	it('пропускает служебные поля и ObjectId/Date', () => {
		const out = run({
			_id: { _bsontype: 'ObjectID' },
			__v: 0,
			kind: 'person',
			ctime: new Date(),
			person: { firstName: 'A' },
		})
		expect(out).toEqual(['A'])
	})

	it('разворачивает mongoose-поддокументы (contact._doc) — регресс B9', () => {
		const contactDoc = {
			_doc: { data: 'x@y.z', description: 'work', _id: { _bsontype: 'ObjectID' } },
			$__: { slot: 1 },
		}
		const out = run({ kind: 'person', person: { contact: [ contactDoc ] } })
		expect(out).toContain('x@y.z')
		expect(out).toContain('work')
	})

	it('не зацикливается на циклических ссылках (mongoose $__parent)', () => {
		const node = { firstName: 'X' }
		node.self = node
		expect(run({ kind: 'person', person: node })).toContain('X')
	})

	it('игнорирует пустые строки', () => {
		expect(run({ kind: 'person', person: { firstName: '', lastName: 'B' } })).toEqual(['B'])
	})
})
