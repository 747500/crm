// Happy-path (новый SPA, Vue3): календарь доступен, сетка рендерится,
// дни недели русские (Пн-первый), клик по дню выбирает дату.
const { test, expect } = require('@playwright/test');

const { login } = require('./helpers');

test('calendar: grid renders and day click selects', async ({ page }) => {
  await login(page);

  await page.goto('/#/calendar');
  await page.reload();

  // сетка
  const weeks = page.locator('.calendar .week');
  await weeks.first().waitFor({ timeout: 15000 });
  expect(await weeks.count()).toBeGreaterThan(0);

  // русские дни недели (Пн-первый)
  await expect(page.locator('.calendar .header .day').first()).toHaveText(
    'пн',
  );

  // клик по дню -> появляется выбранная дата
  const firstDay = page.locator('.calendar .week .day').first();
  await firstDay.click();
  await expect(page.locator('.calendar .week .day.selected')).toHaveCount(1);
});
