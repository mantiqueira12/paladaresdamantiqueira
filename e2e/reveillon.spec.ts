import { expect, test } from '@playwright/test';

const ROUTE = '/jantar-de-reveillon-na-serra-da-mantiqueira/';

test('Réveillon abre os três menus e mantém o pedido específico por WhatsApp', async ({ page }) => {
  await page.goto(ROUTE);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Sua ceia de Réveillon');
  for (const [id, name] of [['classica', 'Clássica'], ['celebracao', 'Celebração'], ['reserva', 'Reserva da Mantiqueira']]) {
    const menu = page.locator(`#${id} details`);
    await menu.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(menu.locator('.menu-content')).toBeVisible();
    const link = menu.getByRole('link', { name: `Consultar ${name}` });
    const href = await link.getAttribute('href');
    if (!href) throw new Error(`Link ausente em ${name}`);
    const message = new URL(href).searchParams.get('text') ?? '';
    expect(message).toContain(name);
    expect(message).toContain('Réveillon');
    expect(message).toContain('31/12/2026');
    expect(message).toContain('10h às 15h');
    expect(await page.locator('.menu-details[open]').count()).toBe(1);
  }
  await expect(page.locator('#encomendar')).toContainText('27/12/2026');
  await expect(page.locator('#encomendar')).toContainText('saldo pago no dia da entrega');
  expect(await page.locator('body').innerText()).not.toContain('R$');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  expect(overflow).toBe(false);
});

test('campanha da home dá acesso às duas ceias e preserva o Natal', async ({ page }) => {
  await page.goto('/');
  const campaign = page.getByRole('complementary', { name: 'Campanha em destaque' });
  await expect(campaign.getByRole('link', { name: 'Ver ceias de Natal' })).toHaveAttribute('href', '/jantar-de-natal-na-serra-da-mantiqueira/#menus');
  await campaign.getByRole('link', { name: 'Ver ceias de Réveillon' }).click();
  await expect(page).toHaveURL(/jantar-de-reveillon-na-serra-da-mantiqueira\/#menus/);
  await page.goto('/jantar-de-natal-na-serra-da-mantiqueira/');
  await expect(page.locator('#encomendar')).toContainText('20/12/2026');
  await expect(page.locator('#encomendar')).toContainText('24/12');
});
