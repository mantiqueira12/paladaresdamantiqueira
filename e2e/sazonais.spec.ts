import { expect, test } from '@playwright/test';

test('Encomendas de Natal têm leitura responsiva e WhatsApp com menu e modalidade', async ({ page }) => {
  await page.route('**/*', route => ['localhost', '127.0.0.1'].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
  await page.goto('/jantar-de-natal-na-serra-da-mantiqueira/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Natal');
  await expect(page.locator('body')).not.toContainText('R$');
  await expect(page.locator('body')).not.toContainText('retirada');
  await expect(page.locator('.agenda')).toContainText('Entrega gratuita em Campos do Jordão');
  await expect(page.locator('#reserva')).toContainText('bacon, cogumelos e tomilho em molho de carne');
  await expect(page.locator('#reserva')).toContainText('frango defumado');
  await expect(page.locator('#classica')).toContainText('castanhas-de-caju');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.getByRole('link', { name: 'Conhecer as três ceias', exact: true }).click();
  await expect(page).toHaveURL(/#menus$/);
  for (const name of ['Clássica', 'Celebração', 'Reserva da Mantiqueira']) {
    const link = page.getByRole('link', { name: `Consultar ${name}`, exact: true });
    const message = new URL(await link.getAttribute('href')).searchParams.get('text');
    expect(message).toContain(name);
    expect(message).toContain('encomenda');
    expect(message).toContain('Natal 2026');
    expect(message).toContain('24/12');
    expect(message).toContain('entrega');
  }
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement.tagName)).toBe('A');
  expect(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle)).not.toBe('none');
});

test('Natal foca em encomendas e preserva a área dos alimentos nas artes', async ({ page }) => {
  await page.route('**/*', route => ['localhost', '127.0.0.1'].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
  await page.goto('/');
  await page.locator('#experiencias a', { hasText: 'Natal' }).click();
  await expect(page).toHaveURL(/jantar-de-natal-na-serra-da-mantiqueira/);
  await expect(page.locator('#chef-em-casa')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Consultar chef em casa', exact: true })).toHaveCount(0);
  for (const image of await page.locator('.hero img,.menu-scene img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    const geometry = await image.evaluate((img: HTMLImageElement) => {
      const { width, height } = img.getBoundingClientRect();
      const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
      return { ratio: width / height, croppedTop: (img.naturalHeight - height / scale) / img.naturalHeight, position: getComputedStyle(img).objectPosition };
    });
    expect(geometry.ratio).toBeCloseTo(1, 1);
    expect(geometry.croppedTop).toBeLessThan(.5);
    expect(geometry.position).toBe('50% 100%');
  }
  await page.locator('#classica .inclusion a').click();
  await expect(page).toHaveURL(/#doces$/);
  await expect(page.locator('#doces')).toContainText('O trifle tem apresentação única');
});
