// Happy-path (новый SPA, Vue3): сохранение настроек пользователя (POST /api/v0/u).
const { test, expect } = require('@playwright/test')

const { login } = require('./helpers')

test('save user settings', async ({ page }) => {
	await login(page)

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
