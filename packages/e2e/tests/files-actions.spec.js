// Happy-path (новый SPA, Vue3): действия файлов — инфо-модалка (JSON в <pre>)
// и «сделать главной» (💡 setMain). Создаём выделенный тестовый контакт и загружаем файл.
const { test, expect } = require('@playwright/test')
const path = require('path')

const { login } = require('./helpers')

const FIXTURE = path.join(__dirname, '..', 'fixtures', 'e2e-upload.png')

test('files: info modal and set main', async ({ page }) => {
	await login(page)

	// отдельный тестовый контакт — не засоряем реальные документы
	const created = await (await page.request.put('/api/v0/doc', {
		headers: { 'Content-Type': 'application/json' },
		data: { kind: 'person', person: { firstName: 'E2E-Actions', lastName: 'Тест' } },
	})).json()
	expect(created._id).toBeTruthy()

	await page.goto(`/#/person/${created._id}`)
	await page.reload()

	const fileInput = page.locator('input[type="file"]').first()
	await fileInput.waitFor({ timeout: 15000 })
	await fileInput.setInputFiles(FIXTURE)

	const actions = page.locator('.thumb .actions')
	await actions.first().waitFor({ timeout: 15000 })
	const newActions = actions.last()

	// инфо -> модалка с JSON в <pre>
	await newActions.getByTitle('Инфо').click()
	await expect(page.locator('.info-modal pre')).toBeVisible()
	await page.locator('.info-modal .close').click()
	await expect(page.locator('.info-modal')).toHaveCount(0)

	// сделать главной -> кнопка становится disabled (mainPicture обновлён)
	await newActions.getByTitle('Сделать главной').click()
	await expect(newActions.getByTitle('Сделать главной')).toBeDisabled({ timeout: 15000 })
})
