// Общие хелперы для e2e.

// Отладочный вход: ставим сессию через in-page fetch (cookie браузера), возвращаем
export async function login (page) {
	await page.goto('/')
	const users = await (await page.request.get('/api/v0/u/list')).json()
	const user = users[0]
	const status = await page.evaluate(async (id) => {
		const r = await fetch('/api/v0/u/set', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ _id: id }),
			credentials: 'include',
		})
		return r.status
	}, user._id)
	return { users, user, status }
}
