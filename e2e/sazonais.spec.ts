import { expect, test } from '@playwright/test';

test('Natal abre os três cardápios nativos e preserva WhatsApp, composição e modalidade', async ({ page }) => {
  await page.route('**/*', route => ['localhost', '127.0.0.1'].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
  await page.goto('/jantar-de-natal-na-serra-da-mantiqueira/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Natal');
  await expect(page.locator('body')).not.toContainText('R$');
  await expect(page.locator('body')).not.toContainText('retirada');
  await expect(page.locator('.natal-opening')).toContainText('entrega gratuita em Campos do Jordão');
  await expect(page.locator('#reserva')).toContainText('bacon, cogumelos e tomilho em molho de carne');
  await expect(page.locator('#reserva')).toContainText('frango defumado');
  await expect(page.locator('#classica')).toContainText('castanhas-de-caju');
  await expect(page.locator('.menu-details')).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  for (const [id, name] of [['classica', 'Clássica'], ['celebracao', 'Celebração'], ['reserva', 'Reserva da Mantiqueira']]) {
    const detail = page.locator(`#${id} details`);
    await expect(detail).not.toHaveAttribute('open');
    await detail.locator('summary').click();
    await expect(detail).toHaveAttribute('open', '');
    const link = page.getByRole('link', { name: `Consultar ${name}`, exact: true });
    await expect(link).toBeVisible();
    const message = new URL(await link.getAttribute('href')).searchParams.get('text');
    expect(message).toContain(name);
    expect(message).toContain('Natal 2026');
    expect(message).toContain('24/12');
    expect(message).toContain('entrega');
  }
  await page.locator('#classica summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#classica details')).toHaveAttribute('open', '');
});

test('Destaque na home leva direto aos menus e a arte preserva a composição inteira', async ({ page }) => {
  await page.route('**/*', route => ['localhost', '127.0.0.1'].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
  await page.goto('/');
  const campaign = page.getByRole('complementary', { name: 'Campanha em destaque' });
  await expect(campaign).toBeVisible();
  expect(await campaign.evaluate(element => element.getBoundingClientRect().top < innerHeight / 2)).toBe(true);
  await campaign.getByRole('link', { name: 'Ver ceias de Natal' }).click();
  await expect(page).toHaveURL(/jantar-de-natal-na-serra-da-mantiqueira\/#menus$/);
  await expect(page.locator('#chef-em-casa')).toHaveCount(0);
  const image = page.locator('.natal-opening img:visible,.campaign-scene-mobile img:visible');
  await expect(image).toHaveCount(1);
  await image.scrollIntoViewIfNeeded();
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  const geometry = await image.evaluate((img: HTMLImageElement) => {
    const { width, height } = img.getBoundingClientRect();
    return { displayed: width / height, original: img.naturalWidth / img.naturalHeight };
  });
  expect(geometry.displayed).toBeCloseTo(geometry.original, 2);
  await page.locator('#classica summary').click();
  await page.locator('#classica .inclusion a').click();
  await expect(page).toHaveURL(/#doces$/);
  await expect(page.locator('#doces')).toContainText('Fernanda Marton');
  await expect(page.locator('#doces')).toContainText('O trifle tem apresentação única');
});
