
// Приводим mongoose-документы к форме, которую ждёт GraphQL-схема:
// id — строка, version — __v, даты — ISO, + __typename для union.

export function capitalize ([ first, ...rest ]) {
	return [ String(first).toUpperCase(), ...rest ].join('')
}

function base (data) {
	if (data.ctime instanceof Date) {
		data.ctime = data.ctime.toISOString()
	}
	if (data.mtime instanceof Date) {
		data.mtime = data.mtime.toISOString()
	}
	return data
}

export function serializeDoc (raw) {
	const { _id, __v, kind, ...data } = raw

	data.id = String(_id)
	data.version = __v
	data.__typename = capitalize(kind)

	return base(data)
}

export function serializeUser (raw) {
	const { _id, __v, ...data } = raw

	data.id = String(_id)
	data.version = __v
	data.__typename = 'User'

	return base(data)
}
