// Happy-path: создание контакта через «+» и последующая правка.
const { test, expect } = require('@playwright/test')

const { login } = require('./helpers')

test('create and edit a contact', async ({ page }) => {
	await login(page)

	await page.goto('/#/person')
	await page.reload()
	await page.locator('.docs .m-doc').first().waitFor()

	// «+» -> форма нового документа
	await page.getByRole('button', { name: '+' }).click()
	await page.locator('.crm-modal').waitFor()

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

	// правка -> POST /api/v0/doc/:id
	await page.getByLabel('Отчество', { exact: true }).waitFor()
	const editResp = page.waitForResponse(
		r => new URL(r.url()).pathname === `/api/v0/doc/${created._id}` && r.request().method() === 'POST',
		{ timeout: 15000 }
	)
	await page.getByLabel('Отчество', { exact: true }).fill('E2E-Отчество')
	await page.getByRole('button', { name: 'Сохранить' }).click()

	const er = await editResp
	expect(er.status()).toBe(200)
})
