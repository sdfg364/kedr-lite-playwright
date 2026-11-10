const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

const appPath = pathToFileURL(
  path.resolve(__dirname, '../kedr_lite.html')
).href;

test('GREEN: успешная оплата 500 рублей', async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0.99;
  });

  await page.goto(appPath);
  await page.locator('#amount').fill('500');
  await page.locator('#pay').click();

  await expect(page.locator('#status'))
    .toHaveText('✅ Оплата прошла: 500 ₽');

  await expect(page.locator('#total')).toHaveText('500');
});

test('RED: приложение ошибочно показывает успех при сумме выше лимита', async ({ page }) => {
  await page.goto(appPath);
  await page.locator('#amount').fill('60000');
  await page.locator('#pay').click();

  await expect(page.locator('#status'))
    .toHaveText('❌ Платёж не прошёл');
});
