// Happy-path (новый SPA, Vue3): поиск через верхнюю строку и открытие результата.
const { test, expect } = require('@playwright/test')

const { login } = require('./helpers')

test('search and open a contact', async ({ page }) => {
	await login(page)
	await page.goto('/#/person')
	await page.reload()

	const input = page.locator('input[type="search"]')
	await input.waitFor({ timeout: 15000 })

	const searchResp = page.waitForResponse(
		r => new URL(r.url()).pathname === '/api/v0/doc/s' && r.request().method() === 'POST',
		{ timeout: 15000 }
	)
	await input.fill('Иванов')
	await input.press('Enter')

	const sr = await searchResp
	expect(sr.status()).toBe(200)

	// результат -> переход на страницу документа (DocEdit)
	const first = page.locator('.list li').first()
	await first.waitFor({ timeout: 10000 })
	await first.click()

	await page.locator('input[type="text"]').first().waitFor({ timeout: 10000 })
})
