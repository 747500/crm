// Smoke нового SPA (packages/web, Vue3): список -> создание -> загрузка файла.
// Требует запущенный vite dev (`npm run dev -w @crm/web`); /api проксируется на BFF.
const { test, expect } = require('@playwright/test')
const path = require('path')

const BASE = process.env.WEB_URL || 'http://127.0.0.1:5173'
const FIXTURE = path.join(__dirname, '..', 'fixtures', 'e2e-upload.png')

test('web (vue3): list -> create -> upload', async ({ page }) => {
	await page.goto(BASE + '/')

	const users = await (await page.request.get(BASE + '/api/v0/u/list')).json()
	expect(users.length).toBeGreaterThan(0)
	await page.evaluate(async (id) => {
		await fetch('/api/v0/u/set', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ _id: id }),
			credentials: 'include',
		})
	}, users[0]._id)

	await page.goto(BASE + '/#/person')
	await page.reload() // сессия уже выставлена — перезагружаем с cookie
	await page.locator('.list li').first().waitFor({ timeout: 15000 })
	expect(await page.locator('.list li').count()).toBeGreaterThan(0)

	// создание
	await page.getByRole('button', { name: '+ Новый' }).click()
	await page.locator('input[type="text"]').first().fill('E2E-WEB-Фамилия')
	const createResp = page.waitForResponse(
		r => new URL(r.url()).pathname === '/api/v0/doc' && r.request().method() === 'PUT',
		{ timeout: 15000 }
	)
	await page.getByRole('button', { name: 'Сохранить' }).click()
	const cr = await createResp
	expect(cr.status()).toBe(200)
	const created = await cr.json()
	expect(created._id).toBeTruthy()

	// загрузка файла
	await page.locator('input[type="file"]').first().waitFor({ timeout: 10000 })
	const uploadResp = page.waitForResponse(
		r => r.url().includes('/upload/') && r.request().method() === 'POST',
		{ timeout: 15000 }
	)
	await page.locator('input[type="file"]').first().setInputFiles(FIXTURE)
	const ur = await uploadResp
	expect(ur.status()).toBe(200)
})
