import { expect, test } from '@playwright/test';

test('landing oferece ligação e consulta direta do catálogo no rodapé', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/jantar-de-natal-na-serra-da-mantiqueira/`);
  const phone = page.locator('footer').getByRole('link', { name: '+55 12 99771-0040', exact: true });
  await phone.scrollIntoViewIfNeeded();
  await expect(phone).toBeVisible();
  await expect(phone).toHaveAttribute('href', 'tel:+5512997710040');
  await phone.focus();
  await expect(phone).toBeFocused();
  await page.locator('footer').getByRole('link', { name: 'Ver cardápios', exact: true }).click();
  await expect(page).toHaveURL(/\/cardapios\/$/);
  await expect(page.locator('.catalog-section')).toHaveCount(14);
  await context.close();
});

test('cardápios são navegáveis e completos com JavaScript desligado', async ({ browser, baseURL }) => {
  if (!baseURL) throw new Error('baseURL deve estar configurada para o teste');
  const context = await browser.newContext({ javaScriptEnabled: false });
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    return ['localhost', '127.0.0.1'].includes(url.hostname) ? route.continue() : route.abort();
  });
  const page = await context.newPage();
  await page.goto(baseURL);
  await page.getByRole('link', { name: 'Consultar os cardápios e as opções de cada experiência' }).click();
  await expect(page).toHaveURL(/\/cardapios\/$/);
  await expect(page.locator('h1')).toHaveText('Cardápios para celebrar na Mantiqueira');
  await page.getByText('O que muda entre as modalidades', { exact: true }).click();
  await expect(page.locator('.catalog-scope')).toHaveAttribute('open', '');
  await expect(page.locator('.catalog-scope')).toContainText('Bebidas, vinhos');
  await expect(page.locator('.catalog-section')).toHaveCount(14);
  await page.locator('#indice').getByRole('link', { name: 'Harmonização Guiada', exact: true }).click();
  await expect(page.locator('#harmonizacao-guiada')).toContainText('Creme de pinhão');
  await expect(page.locator('#harmonizacao-guiada')).toContainText('(inverno)');
  await expect(page.getByRole('link', { name: '+55 12 99771-0040' })).toHaveAttribute('href', 'tel:+5512997710040');
  const markdown = await (await page.request.get(new URL('/cardapios.md', baseURL).toString())).text();
  expect(markdown).toContain('Creme de pinhão');
  expect(markdown).not.toMatch(/preco_por_pessoa|servico_hora|dieteticas|R\$\s*\d/);
  await context.close();
});

test('pedido a partir do catálogo conserva a experiência escolhida', async ({ page }) => {
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    return ['localhost', '127.0.0.1'].includes(url.hostname) ? route.continue() : route.abort();
  });
  await page.goto('/cardapios/');
  await page.getByRole('link', { name: 'Conversar sobre Origens da Serra', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByLabel('Experiência desejada', { exact: true })).toHaveValue('Origens da Serra');
});

test('ficha com duas modalidades distingue sobremesa da experiência completa', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Ver detalhes de Noite do Hambúrguer', exact: true }).click();
  const modal = page.getByRole('dialog');
  await expect(modal.getByText('Inclui na experiência completa', { exact: true })).toBeVisible();
  await expect(modal.getByText(/confeitaria e sobremesas do Ateliê não estão incluídas/)).toBeVisible();
});
