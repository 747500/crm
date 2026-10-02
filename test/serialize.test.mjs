import { describe, it, expect } from 'vitest'

import { serializeDoc, serializeUser, capitalize } from '../packages/graphql-mongodb/graphql/serialize.ts'

describe('serialize (graphql resolvers)', () => {
	it('capitalize', () => {
		expect(capitalize('person')).toBe('Person')
		expect(capitalize('contract')).toBe('Contract')
	})

	it('serializeDoc: id — строка, version, __typename, даты ISO', () => {
		const out = serializeDoc({
			_id: { toString: () => 'abc' },
			__v: 3,
			kind: 'person',
			ctime: new Date('2021-03-01T17:23:38.678Z'),
			person: { firstName: 'Иван' },
		})
		expect(out.id).toBe('abc')
		expect(out.version).toBe(3)
		expect(out.__typename).toBe('Person')
		expect(out.ctime).toBe('2021-03-01T17:23:38.678Z')
		expect(out.person).toEqual({ firstName: 'Иван' })
		expect(out._id).toBeUndefined()
		expect(out.kind).toBeUndefined()
	})

	it('serializeUser', () => {
		const out = serializeUser({ _id: { toString: () => 'u1' }, __v: 0, name: 'Serge' })
		expect(out).toMatchObject({ id: 'u1', version: 0, __typename: 'User', name: 'Serge' })
	})
})
