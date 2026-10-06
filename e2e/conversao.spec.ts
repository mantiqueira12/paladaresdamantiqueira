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

test('o submit interceptado registra só metadados permitidos e confirma o próximo passo', async ({ page }) => {
  await page.addInitScript(() => {
    const analyticsWindow = window as unknown as {
      __gtagCalls: unknown[][];
      gtag: (...args: unknown[]) => void;
    };
    analyticsWindow.__gtagCalls = [];
    analyticsWindow.gtag = (...args: unknown[]) => analyticsWindow.__gtagCalls.push(args);
  });

  let requisicoesWhatsApp = 0;
  let abriuPopup = false;
  await page.route(/^https:\/\/wa\.me\//, async (route) => {
    requisicoesWhatsApp += 1;
    await route.abort();
  });
  page.on('popup', () => {
    abriuPopup = true;
  });

  const pedido = await abrirPedido(page);
  await pedido.getByLabel('Experiência desejada').selectOption({ value: 'Entre Amigos' });
  await pedido.getByLabel('Seu nome').fill('Nome Sigiloso');
  await pedido.getByLabel('Quantidade de convidados').fill('37');
  await pedido.getByLabel('Horário desejado').fill('18:30');
  await pedido.getByLabel('Ocasião').selectOption({ value: 'Aniversário' });
  await pedido.getByLabel('Cidade / local').fill('Campos do Jordão');

  await pedido.locator('form').evaluate((form) => {
    form.addEventListener('submit', (evento) => evento.preventDefault(), { capture: true });
  });
  await pedido.getByRole('button', { name: 'Abrir no WhatsApp' }).click();

  await expect(pedido.getByText('Se o WhatsApp abriu, revise a mensagem e toque em enviar por lá.')).toBeVisible();
  const chamadas = await page.evaluate(() => {
    const analyticsWindow = window as unknown as { __gtagCalls: unknown[][] };
    return analyticsWindow.__gtagCalls;
  });
  expect(chamadas).toHaveLength(1);
  const [comando, evento, parametros] = chamadas[0] as [string, string, Record<string, unknown>];
  expect([comando, evento]).toEqual(['event', 'solicitar_orcamento']);
  expect(parametros).toMatchObject({
    origem: 'header',
    experiencia: 'Entre Amigos',
    ocasiao: 'Aniversário',
    cidade: 'Campos do Jordão',
    pessoas: 'Mais de 20 pessoas',
    so_servico: false,
  });
  expect(parametros).not.toHaveProperty('nome');
  expect(parametros).not.toHaveProperty('horario');
  expect(JSON.stringify(parametros)).not.toContain('Nome Sigiloso');
  expect(JSON.stringify(parametros)).not.toContain('18:30');
  expect(JSON.stringify(parametros)).not.toContain('37');
  expect(requisicoesWhatsApp).toBe(0);
  expect(abriuPopup).toBe(false);
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

test('editar o pedido invalida a confirmação de cópia e atualiza a prévia', async ({ page, context }) => {
  await neutralizarAnalytics(page);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  const pedido = await abrirPedido(page);
  const copiar = pedido.getByRole('button', { name: 'Copiar mensagem' });
  await copiar.click();
  await expect(pedido.getByRole('button', { name: 'Copiada' })).toBeVisible();

  await pedido.getByLabel('Cidade / local').fill('Santo Antônio do Pinhal');
  await expect(pedido.getByRole('button', { name: 'Copiar mensagem' })).toBeVisible();
  await expect(pedido.locator('pre')).toContainText('Santo Antônio do Pinhal');
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

test('o backdrop do detalhe fecha o modal e devolve foco sem transformar o conteúdo em alvo', async ({ page }) => {
  await neutralizarAnalytics(page);
  await page.goto('/');
  const abrir = page.getByRole('button', { name: 'Ver detalhes de Entre Amigos' });
  await abrir.click();
  const detalhe = page.getByRole('dialog', { name: 'Entre Amigos' });
  await expect(detalhe).toBeVisible();

  await detalhe.getByRole('heading', { name: 'Entre Amigos' }).click();
  await expect(detalhe).toBeVisible();
  await page.mouse.click(5, 5);

  await expect(detalhe).toBeHidden();
  await expect(abrir).toBeFocused();
});

test('o backdrop do pedido fecha o modal e devolve foco sem transformar o conteúdo em alvo', async ({ page }) => {
  await neutralizarAnalytics(page);
  await page.goto('/');
  const abrir = page.getByRole('banner').getByRole('button', { name: 'Solicitar' });
  await abrir.click();
  const pedido = page.getByRole('dialog', { name: 'Vamos planejar o seu encontro?' });
  await expect(pedido).toBeVisible();

  await pedido.getByRole('heading', { name: 'Vamos planejar o seu encontro?' }).click();
  await expect(pedido).toBeVisible();
  await page.mouse.click(5, 5);

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
