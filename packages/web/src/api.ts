export interface User {
	_id: string
	name: string
	current?: boolean
}

export interface PersonDoc {
	_id: string
	kind: string
	user: string
	person?: {
		firstName?: string
		lastName?: string
		middleName?: string
	}
}

const BASE = '/api/v0'

async function req<T> (path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`${BASE}${path}`, { credentials: 'include', ...init })

	if (!res.ok) {
		throw new Error(`${res.status} ${res.statusText} — ${path}`)
	}

	const type = res.headers.get('content-type') ?? ''

	return (type.includes('application/json') ? res.json() : res.text()) as Promise<T>
}

export const api = {
	listUsers: () => req<User[]>('/u/list'),

	setUser: (id: string) => req<string>('/u/set', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ _id: id }),
	}),

	userInfo: () => req<Record<string, unknown>>('/u/info'),

	listDocs: <T = PersonDoc>(kind: string) => req<T[]>(`/doc/list/${kind}`),
}
