// Happy-path (новый SPA, Vue3): создание контакта через «+ Новый» и последующая правка.
const { test, expect } = require('@playwright/test')

const { login } = require('./helpers')

test('create and edit a contact', async ({ page }) => {
	await login(page)

	await page.goto('/#/person')
	await page.reload()
	await page.locator('.list li').first().waitFor({ timeout: 15000 })

	// «+ Новый» -> форма нового документа
	await page.getByRole('button', { name: '+ Новый' }).click()
	await page.getByLabel('Фамилия', { exact: true }).waitFor({ timeout: 10000 })
	await page.getByLabel('Фамилия', { exact: true }).fill('E2E-Фамилия')
	await page.getByLabel('Имя', { exact: true }).fill('E2E-Имя')

	// создать -> PUT /api/v0/doc
	const createResp = page.waitForResponse(
		r => new URL(r.url()).pathname === '/api/v0/doc' && r.request().method() === 'PUT',
		{ timeout: 15000 }
	)
	await page.getByRole('button', { name: 'Сохранить' }).click()

	const cr = await createResp
	expect(cr.status()).toBe(200)
	const created = await cr.json()
	expect(created._id).toBeTruthy()

	// после создания SPA переходит на страницу правки -> POST /api/v0/doc/:id
	await page.getByLabel('Отчество', { exact: true }).waitFor({ timeout: 15000 })
	const editResp = page.waitForResponse(
		r => new URL(r.url()).pathname === `/api/v0/doc/${created._id}` && r.request().method() === 'POST',
		{ timeout: 15000 }
	)
	await page.getByLabel('Отчество', { exact: true }).fill('E2E-Отчество')
	await page.getByRole('button', { name: 'Сохранить' }).click()

	const er = await editResp
	expect(er.status()).toBe(200)
})
