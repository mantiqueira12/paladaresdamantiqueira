import { expect, test, type Page } from '@playwright/test';

async function abrirPedido(page: Page) {
  await neutralizarAnalytics(page);
  await page.goto('/');
  await page.getByRole('banner').getByRole('button', { name: 'Solicitar' }).click();
  const pedido = page.getByRole('dialog', { name: 'Vamos planejar o seu encontro?' });
  await expect(pedido).toBeVisible();
  return pedido;
}

async function neutralizarAnalytics(page: Page) {
  await page.route(/googletagmanager\.com|google-analytics\.com/, async (route) => {
    const script = route.request().resourceType() === 'script';
    await route.fulfill({
      status: script ? 200 : 204,
      contentType: script ? 'application/javascript' : 'text/plain',
      body: '',
    });
  });
}

test('a solicitação conserva quantidade, horário e mensagem pronta sem enviá-la', async ({ page }) => {
  const pedido = await abrirPedido(page);
  await pedido.getByLabel('Experiência desejada').selectOption({ value: 'Entre Amigos' });
  await pedido.getByLabel('Quantidade de convidados').fill('37');
  await pedido.getByLabel('Horário desejado').fill('18:30');

  const pre = pedido.locator('pre');
  await expect(pre).toContainText('*Entre Amigos*');
  await expect(pre).toContainText('• Convidados: 37');
  await expect(pre).toContainText('• Horário desejado: 18:30');
  await expect(pedido.locator('input[name="text"]')).toHaveValue(await pre.innerText());
  await expect(pedido.getByRole('button', { name: 'Abrir no WhatsApp' })).toBeVisible();
  await expect(pedido.getByText('Se o WhatsApp abriu, revise a mensagem e toque em enviar por lá.')).toHaveCount(0);
});

test('o caminho detalhe → pedido conserva a experiência depois da renderização', async ({ page }) => {
  await neutralizarAnalytics(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Ver detalhes de Entre Amigos' }).click();
  const detalhe = page.getByRole('dialog', { name: 'Entre Amigos' });
  await expect(detalhe).toBeVisible();
  await detalhe.getByRole('button', { name: 'Solicitar esta experiência' }).click();

  const pedido = page.getByRole('dialog', { name: 'Vamos planejar o seu encontro?' });
  await expect(pedido).toBeVisible();
  const experiencia = pedido.getByLabel('Experiência desejada');
  await expect(experiencia).toHaveValue('Entre Amigos');
  await pedido.getByLabel('Quantidade de convidados').fill('37');
  await pedido.getByLabel('Horário desejado').fill('18:30');
  await expect(pedido.locator('pre')).toContainText('*Entre Amigos*');
  await expect(pedido.locator('pre')).toContainText('• Convidados: 37');
  await expect(pedido.locator('pre')).toContainText('• Horário desejado: 18:30');
});

test('o pedido fecha com Escape e devolve foco ao botão que o abriu', async ({ page }) => {
  await neutralizarAnalytics(page);
  await page.goto('/');
  const abrir = page.getByRole('banner').getByRole('button', { name: 'Solicitar' });
  await abrir.click();
  const pedido = page.getByRole('dialog', { name: 'Vamos planejar o seu encontro?' });
  await expect(pedido).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(pedido).toBeHidden();
  await expect(abrir).toBeFocused();
});

test('a home não tem erro de execução nem rolagem horizontal', async ({ page }) => {
  const erros: string[] = [];
  page.on('pageerror', (erro) => erros.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') erros.push(mensagem.text());
  });
  await neutralizarAnalytics(page);
  await page.goto('/');
  await expect(page).toHaveTitle(/Chef Particular na Serra da Mantiqueira/);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  const dimensoes = await page.evaluate(() => ({ pagina: document.documentElement.scrollWidth, viewport: window.innerWidth }));
  expect(dimensoes.pagina).toBeLessThanOrEqual(dimensoes.viewport);
  expect(erros).toEqual([]);
});

test('a vitrine mantém as decisões de vocabulário, preço e três portas', async ({ page }) => {
  await neutralizarAnalytics(page);
  await page.goto('/');
  const texto = (await page.locator('body').innerText()).toLocaleLowerCase('pt-BR');
  for (const proibida of ['buffet', 'rodízio', 'rodizio', 'quilo', 'marmita', 'porção', 'porcao', 'coffee break', 'evento corporativo']) {
    expect(texto, `termo proibido na vitrine: ${proibida}`).not.toContain(proibida);
  }
  expect(texto.match(/r\$\s*[\d.,]+/g) ?? []).toEqual([]);
  for (const porta of ['Íntima', 'Casa Cheia', 'Celebração']) await expect(page.getByText(porta, { exact: true }).first()).toBeAttached();
});

test.describe('sitemap', () => {
  test.skip(({ isMobile }) => isMobile, 'verificação repetida apenas em desktop');

  test('todas as rotas listadas respondem com título, H1 e canonical', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text();
    const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname);
    expect(paths).toHaveLength(15);
    for (const path of paths) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
      const html = await response.text();
      expect(html, `${path}: título`).toMatch(/<title>[^<]{10,}<\/title>/);
      expect(html, `${path}: H1`).toMatch(/<h1[\s>]/);
      expect(html, `${path}: canonical`).toMatch(/rel="canonical"/);
    }
  });
});
