// Happy-path: поиск через верхнюю строку и открытие результата.
const { test, expect } = require('@playwright/test')

const { login } = require('./helpers')

test('search and open a contact', async ({ page }) => {
	await login(page)
	await page.goto('/')
	await page.reload()

	const input = page.locator('input[placeholder="Search"]')
	await input.waitFor()
	await input.click()

	const searchResp = page.waitForResponse(
		r => new URL(r.url()).pathname === '/api/v0/doc/s' && r.request().method() === 'POST',
		{ timeout: 15000 }
	)
	await input.fill('Иванов')

	const sr = await searchResp
	expect(sr.status()).toBe(200)

	const first = page.locator('.search-panel .m-doc').first()
	await first.waitFor({ timeout: 10000 })
	await first.click()

	await page.locator('.crm-modal').waitFor()
})
