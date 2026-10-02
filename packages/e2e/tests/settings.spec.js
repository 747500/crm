// Happy-path: сохранение настроек пользователя (POST /api/v0/u).
const { test, expect } = require('@playwright/test')

test('save user settings', async ({ page }) => {
	await page.goto('/')

	// отладочный вход (сессия)
	const users = await (await page.request.get('/api/v0/u/list')).json()
	const setStatus = await page.evaluate(async (id) => {
		const r = await fetch('/api/v0/u/set', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ _id: id }),
			credentials: 'include',
		})
		return r.status
	}, users[0]._id)
	expect(setStatus).toBe(200)

	// страница настроек (hash-роут)
	await page.goto('/#/settings')
	await page.reload()
	await page.locator('input[type="time"]').waitFor({ timeout: 15000 })

	// меняем время уведомления
	await page.fill('input[type="time"]', '07:15')

	const saveResp = page.waitForResponse(
		r => r.url().endsWith('/api/v0/u') && r.request().method() === 'POST',
		{ timeout: 15000 }
	)
	await page.getByRole('button', { name: 'Сохранить' }).click()

	const resp = await saveResp
	expect(resp.status()).toBe(200)

	// проверяем, что сохранилось
	const info = await page.evaluate(async () =>
		(await fetch('/api/v0/u/info', { credentials: 'include' })).json())
	expect(info.notifyBirthdayAt).toBe('07:15')
})
