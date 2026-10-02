// Happy-path: отладочный вход (сессия через in-page fetch), открыть контакт,
// загрузить файл через вкладку «Файлы» и дождаться 200 от /upload/.
// Роутер у SPA — hash (#/...).
const { test, expect } = require('@playwright/test')
const path = require('path')

const FIXTURE = path.join(__dirname, '..', 'fixtures', 'e2e-upload.png')

test('upload a file to a contact', async ({ page }) => {
	await page.goto('/')

	// отладочный вход: берём пользователя и ставим сессию из самой страницы
	const users = await (await page.request.get('/api/v0/u/list')).json()
	expect(users.length).toBeGreaterThan(0)

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

	// перезагрузка уже с cookie сессии -> список контактов
	await page.goto('/#/person')
	await page.reload()
	const firstDoc = page.locator('.docs .m-doc').first()
	await firstDoc.waitFor({ timeout: 20000 })
	await firstDoc.click()

	// вкладка «Файлы» в модалке документа
	await page.locator('.crm-modal').waitFor()
	await page.getByRole('link', { name: 'Файлы' }).click()

	// ставим файл в очередь
	await page.setInputFiles('input[name="addFile"]', FIXTURE)
	await expect(page.locator('.files-panel .queue .list .item')).toHaveCount(1)

	// загрузить + ждём 200 от /upload/
	const uploadResponse = page.waitForResponse(
		r => r.url().includes('/upload/') && r.request().method() === 'POST',
		{ timeout: 15000 }
	)
	await page.getByRole('button', { name: 'Загрузить' }).click()

	const resp = await uploadResponse
	expect(resp.status()).toBe(200)

	// очередь очистилась после drain
	await expect(page.locator('.files-panel .queue .list')).toHaveCount(0)
})
