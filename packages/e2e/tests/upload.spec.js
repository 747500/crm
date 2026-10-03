// Happy-path (новый SPA, Vue3): создать выделенный тестовый контакт, загрузить
// файл через панель «Файлы» (auto-upload на выборе файла) и дождаться 200 от /upload/.
const { test, expect } = require('@playwright/test');
const path = require('path');

const { login } = require('./helpers');

const FIXTURE = path.join(__dirname, '..', 'fixtures', 'e2e-upload.png');

test('upload a file to a contact', async ({ page }) => {
  await login(page);

  // отдельный тестовый контакт — не засоряем реальные документы
  const created = await (
    await page.request.put('/api/v0/doc', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        kind: 'person',
        person: { firstName: 'E2E-Upload', lastName: 'Тест' },
      },
    })
  ).json();
  expect(created._id).toBeTruthy();

  await page.goto(`/#/person/${created._id}`);
  await page.reload();

  // панель «Файлы» появляется у сохранённого документа
  await page
    .locator('input[type="file"]')
    .first()
    .waitFor({ timeout: 15000 });

  // выбор файла -> auto-upload -> ждём 200 от /upload/
  const uploadResponse = page.waitForResponse(
    (r) => r.url().includes('/upload/') && r.request().method() === 'POST',
    { timeout: 15000 },
  );
  await page.locator('input[type="file"]').first().setInputFiles(FIXTURE);

  const resp = await uploadResponse;
  expect(resp.status()).toBe(200);

  // после загрузки панель перечитывает список файлов -> появляется превью/элемент
  await expect(page.locator('.thumbs li').first()).toBeVisible({
    timeout: 15000,
  });
});
