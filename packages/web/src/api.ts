export interface User { _id: string; name: string; current?: boolean }
export interface DocModel { _id?: string | null; kind: string; user?: string; owner?: string; mainPicture?: string; [k: string]: any }
export interface FileMeta { _id: string; contentType: string; filename: string; length: number; ctime: string; mtime: string; meta: { caption?: string } }

const BASE = '/api/v0'

async function req<T> (path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`${BASE}${path}`, { credentials: 'include', ...init })
	if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${path}`)
	const type = res.headers.get('content-type') ?? ''
	return (type.includes('application/json') ? res.json() : res.text()) as Promise<T>
}

function json (body: unknown): RequestInit {
	return { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
}

export const api = {
	listUsers: () => req<User[]>('/u/list'),
	setUser: (id: string) => req<string>('/u/set', json({ _id: id })),
	userInfo: () => req<Record<string, unknown>>('/u/info'),

	listDocs: (kind: string) => req<DocModel[]>(`/doc/list/${kind}`),
	getDoc: (id: string) => req<DocModel>(`/doc/${id}`),
	createDoc: (payload: Record<string, unknown>) => req<DocModel>('/doc', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
	updateDoc: (id: string, payload: Record<string, unknown>) => req<DocModel>(`/doc/${id}`, json(payload)),

	listFiles: (docId: string) => req<string[]>(`/doc/${docId}/files`),
	fileMeta: (id: string) => req<FileMeta>(`/f/meta/${id}`),
	fileUrl: (id: string, thumb = false) => `${BASE}/f/${id}${thumb ? '/t' : ''}`,

	saveCaption: (id: string, caption: string) => req<FileMeta>(`/f/meta/${id}`, json({ caption })),
	deleteFile: (id: string) => req<unknown>(`/f/${id}`, { method: 'DELETE' }),

	uploadFile (docId: string, file: File, caption = '') {
		return fetch(`${BASE}/f/${docId}/upload/${encodeURIComponent(file.name)}`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': file.type || 'application/octet-stream',
				'X-Meta-Caption': encodeURIComponent(caption),
				'Last-Modified': new Date(file.lastModified || Date.now()).toUTCString(),
			},
			body: file,
		}).then(r => { if (!r.ok) throw new Error(`upload ${r.status}`); return r.json() as Promise<{ file_id: string }> })
	},
}
