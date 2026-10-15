import { expect, test } from '@playwright/test';

test('Natal preserva ocasião e página ao abrir pedido, com prova identificada', async ({ page }) => {
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    return ['localhost', '127.0.0.1'].includes(url.hostname) ? route.continue() : route.abort();
  });
  await page.goto('/');
  await page.locator('#experiencias a', { hasText: 'Natal' }).click();
  await expect(page).toHaveURL(/jantar-de-natal-na-serra-da-mantiqueira/);
  await expect(page.locator('h1')).toContainText('Natal');
  const caption = page.locator('figcaption', { hasText: 'Registro real de Origens da Serra' });
  await expect(caption).toBeVisible();
  await expect(page.getByText(/não é um registro de ceia de Natal ou Réveillon/)).toBeVisible();
  const source = await page.content();
  const hero = page.locator('.hero a[href*="pedido=1"]').first();
  expect(source).toContain('ocasiao=Natal+na+serra');
  await hero.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByLabel('Ocasião', { exact: true })).toHaveValue('Natal na serra');
  expect(new URL(page.url()).searchParams.get('pagina')).toBe('jantar-de-natal-na-serra-da-mantiqueira');
});
