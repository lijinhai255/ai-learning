import { test, expect } from '@playwright/test';

test('web smoke page is reachable', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Miaoma Todo/i);
});
