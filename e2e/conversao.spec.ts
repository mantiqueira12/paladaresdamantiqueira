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

async function controlarClipboard(page: Page) {
  await page.addInitScript(() => {
    const writes: Array<{
      text: string;
      resolve: () => void;
      reject: (reason?: unknown) => void;
    }> = [];
    Object.defineProperty(window, '__clipboardWrites', { configurable: true, value: writes });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText(text: string) {
          return new Promise<void>((resolve, reject) => writes.push({ text, resolve, reject }));
        },
      },
    });
  });
}

type ClipboardWrites = Array<{
  text: string;
  resolve: () => void;
  reject: (reason?: unknown) => void;
}>;

async function aguardarEscritasClipboard(page: Page, quantidade: number) {
  await expect.poll(() => page.evaluate(() => (
    (window as typeof window & { __clipboardWrites: ClipboardWrites }).__clipboardWrites.length
  ))).toBe(quantidade);
}

async function observarSaida(page: Page) {
  return page.evaluate(() => new Promise<{ opacidades: string[]; quadros: number }>((resolve) => {
    const opacidadesObservadas: string[] = [];
    let quadrosObservados = 0;
    document.querySelector<HTMLButtonElement>('[role="dialog"] button[aria-label="Fechar"]')?.click();
    const observar = () => {
      quadrosObservados += 1;
      const overlay = document.querySelector<HTMLElement>('[data-modal-overlay]');
      const dialogo = document.querySelector<HTMLElement>('[role="dialog"]');
      if (!overlay || !dialogo) {
        resolve({ opacidades: opacidadesObservadas, quadros: quadrosObservados });
        return;
      }
      opacidadesObservadas.push(`${getComputedStyle(overlay).opacity}:${getComputedStyle(dialogo).opacity}`);
      requestAnimationFrame(observar);
    };
    requestAnimationFrame(observar);
  }));
}

async function fecharSemFade(page: Page, modal: ReturnType<Page['getByRole']>) {
  const saida = await observarSaida(page);
  await expect(modal).toBeHidden();
  expect(saida.opacidades.every((opacidade) => opacidade === '1:1')).toBe(true);
  expect(saida.quadros).toBeLessThanOrEqual(2);
}

async function fecharComFade(page: Page, modal: ReturnType<Page['getByRole']>) {
  const saida = await observarSaida(page);
  await expect(modal).toBeHidden();
  expect(saida.opacidades.some((opacidade) => {
    const [overlay, dialogo] = opacidade.split(':').map(Number);
    return (overlay > 0 && overlay < 1) || (dialogo > 0 && dialogo < 1);
  })).toBe(true);
  expect(saida.quadros).toBeGreaterThan(2);
  expect(saida.quadros).toBeLessThan(40);
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

test('uma cópia resolvida depois da edição não confirma o texto novo', async ({ page }) => {
  await neutralizarAnalytics(page);
  await controlarClipboard(page);
  await page.goto('/');
  const pedido = await abrirPedido(page);
  const cidade = pedido.getByLabel('Cidade / local');
  await cidade.fill('São Bento do Sapucaí');
  await pedido.getByRole('button', { name: 'Copiar mensagem' }).click();
  await aguardarEscritasClipboard(page, 1);
  expect(await page.evaluate(() => (
    (window as typeof window & { __clipboardWrites: ClipboardWrites }).__clipboardWrites[0].text
  ))).toContain('São Bento do Sapucaí');

  await cidade.fill('Santo Antônio do Pinhal');
  await page.evaluate(() => (
    (window as typeof window & { __clipboardWrites: ClipboardWrites }).__clipboardWrites[0].resolve()
  ));
  await expect(pedido.getByRole('button', { name: 'Copiar mensagem' })).toBeVisible();

  await pedido.getByRole('button', { name: 'Copiar mensagem' }).click();
  await aguardarEscritasClipboard(page, 2);
  await page.evaluate(() => (
    (window as typeof window & { __clipboardWrites: ClipboardWrites }).__clipboardWrites[1].resolve()
  ));
  await expect(pedido.getByRole('button', { name: 'Copiada' })).toBeVisible();
});

test('uma rejeição antiga do clipboard não substitui a confirmação mais recente', async ({ page }) => {
  await neutralizarAnalytics(page);
  await controlarClipboard(page);
  await page.goto('/');
  const pedido = await abrirPedido(page);
  const cidade = pedido.getByLabel('Cidade / local');
  await cidade.fill('São Bento do Sapucaí');
  await pedido.getByRole('button', { name: 'Copiar mensagem' }).click();
  await aguardarEscritasClipboard(page, 1);

  await cidade.fill('Santo Antônio do Pinhal');
  await pedido.getByRole('button', { name: 'Copiar mensagem' }).click();
  await aguardarEscritasClipboard(page, 2);
  await page.evaluate(() => (
    (window as typeof window & { __clipboardWrites: ClipboardWrites }).__clipboardWrites[1].resolve()
  ));
  await expect(pedido.getByRole('button', { name: 'Copiada' })).toBeVisible();

  await page.evaluate(() => (
    (window as typeof window & { __clipboardWrites: ClipboardWrites }).__clipboardWrites[0].reject(new Error('late failure'))
  ));
  await expect(pedido.getByRole('button', { name: 'Copiada' })).toBeVisible();
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

test('o skeleton acompanha a espera real da imagem e some depois da carga', async ({ page }) => {
  await neutralizarAnalytics(page);
  let liberarResposta!: () => void;
  let iniciouResposta!: () => void;
  const respostaLiberada = new Promise<void>((resolve) => { liberarResposta = resolve; });
  const respostaIniciada = new Promise<void>((resolve) => { iniciouResposta = resolve; });
  await page.route('**/portfolio/mesa-de-amigos*.webp', async (route) => {
    iniciouResposta();
    await respostaLiberada;
    await route.continue();
  });

  await page.goto('/');
  await page.locator('#experiencias').scrollIntoViewIfNeeded();
  const capa = page.getByRole('img', { name: 'Entre Amigos' });
  await respostaIniciada;
  await expect(capa).toHaveCSS('background-image', /linear-gradient/);

  liberarResposta();
  await expect(capa).toHaveCSS('background-image', 'none');

  await page.getByRole('button', { name: 'Ver detalhes de Entre Amigos' }).click();
  await expect(page.getByRole('dialog', { name: 'Entre Amigos' }).getByRole('img', { name: 'Entre Amigos' })).toHaveCSS('background-image', 'none');
});

test('imagem com erro troca pelo fallback e encerra o estado de espera', async ({ page }) => {
  await neutralizarAnalytics(page);
  await page.route('**/portfolio/mesa-de-amigos*.webp', (route) => route.abort());
  await page.goto('/');
  await page.locator('#experiencias').scrollIntoViewIfNeeded();
  const capa = page.getByRole('img', { name: 'Entre Amigos' });

  await expect(capa).toHaveAttribute('src', /fallback\.webp/);
  await expect(capa).not.toHaveAttribute('data-image-pending', 'true');
  await expect(capa).toBeVisible();
});

test('o skeleton volta enquanto uma imagem fallback ainda está carregando', async ({ page }) => {
  await neutralizarAnalytics(page);
  await page.route('**/portfolio/mesa-de-amigos*.webp', (route) => route.abort());
  let liberarFallback!: () => void;
  let iniciouFallback!: () => void;
  const fallbackLiberado = new Promise<void>((resolve) => { liberarFallback = resolve; });
  const fallbackIniciado = new Promise<void>((resolve) => { iniciouFallback = resolve; });
  await page.route('**/portfolio/fallback.webp', async (route) => {
    iniciouFallback();
    await fallbackLiberado;
    await route.continue();
  });

  await page.goto('/');
  await page.locator('#experiencias').scrollIntoViewIfNeeded();
  const capa = page.getByRole('img', { name: 'Entre Amigos' });
  await fallbackIniciado;
  await expect(capa).toHaveAttribute('src', /fallback\.webp/);
  await expect(capa).toHaveAttribute('data-image-pending', 'true');
  await expect(capa).toHaveCSS('background-image', /linear-gradient/);

  liberarFallback();
  await expect(capa).not.toHaveAttribute('data-image-pending', 'true');
});

test('o conteúdo pré-renderizado permanece visível sem JavaScript', async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: page.viewportSize() ?? undefined });
  const pageSemScript = await context.newPage();
  await pageSemScript.goto('http://localhost:4173/');

  await expect(pageSemScript.getByRole('heading', { level: 1 }).first()).toBeVisible();
  const experiencia = pageSemScript.getByRole('heading', { name: 'Entre Amigos' }).first();
  await expect(experiencia).toBeVisible();
  const cartao = experiencia.locator('xpath=ancestor::article');
  await expect(cartao.getByRole('img', { name: 'Entre Amigos' })).toBeVisible();
  const estado = await cartao.evaluate((element) => ({
    opacidade: Number(getComputedStyle(element).opacity),
    animacao: getComputedStyle(element).animationName,
    jsClass: document.documentElement.classList.contains('js'),
  }));
  expect(estado.opacidade).toBeGreaterThan(0);
  expect(estado.animacao).toBe('none');
  expect(estado.jsClass).toBe(false);
  await context.close();
});

test('o fio de progresso acompanha o avanço da leitura sem interceptar controles', async ({ page }) => {
  await page.goto('/');
  const progresso = page.locator('[data-scroll-progress-fill]');
  await expect(progresso.locator('..')).toBeVisible();
  await expect.poll(async () => progresso.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a)).toBeLessThan(0.1);

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(async () => progresso.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a)).toBeGreaterThan(0.9);
  await expect(progresso).toHaveCSS('pointer-events', 'none');
});

test('trocas rápidas de filtro preservam a seleção e a quantidade final', async ({ page }) => {
  await page.goto('/');
  const grade = page.locator('.experience-card').first().locator('xpath=..');
  await expect(grade).toHaveCSS('opacity', '1');

  await page.evaluate(() => {
    for (const nome of ['Casa cheia', 'Grandes celebrações', 'Só os mais chegados']) {
      const botao = [...document.querySelectorAll<HTMLButtonElement>('button')]
        .find((item) => item.textContent?.trim() === nome);
      botao?.click();
    }
  });

  await expect(page.getByRole('button', { name: 'Só os mais chegados' })).toHaveAttribute('aria-pressed', 'true');
  const status = page.getByRole('status');
  await expect(status).toContainText('para Só os mais chegados');
  const quantidade = Number((await status.innerText()).match(/^\d+/)?.[0]);
  await expect(page.locator('.experience-card')).toHaveCount(quantidade);
  await expect(page.locator('.experience-card').first()).toBeVisible();
});

test('reduzir movimento remove reveal/progresso e encerra modal sem espera', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await neutralizarAnalytics(page);
  await page.goto('/');
  await page.locator('#experiencias').scrollIntoViewIfNeeded();
  const card = page.locator('.experience-card').first();
  await expect(card).toHaveCSS('opacity', '1');
  await expect(card).toHaveCSS('animation-name', 'none');
  await expect(page.locator('[data-scroll-progress-fill]')).toHaveCSS('animation-name', 'none');

  const abrir = page.getByRole('button', { name: 'Ver detalhes de Entre Amigos' });
  await abrir.click();
  const modal = page.getByRole('dialog', { name: 'Entre Amigos' });
  await expect(modal).toBeVisible();
  await expect(modal).toHaveCSS('opacity', '1');
  await expect(modal).toHaveCSS('transform', 'none');
  const iniciou = await page.evaluate(() => performance.now());
  await fecharSemFade(page, modal);
  const duracao = await page.evaluate((inicio) => performance.now() - inicio, iniciou);
  expect(duracao).toBeLessThan(1000);

  const abrirPedidoButton = page.getByRole('banner').getByRole('button', { name: 'Solicitar' });
  await abrirPedidoButton.click();
  const pedido = page.getByRole('dialog', { name: 'Vamos planejar o seu encontro?' });
  await expect(pedido).toBeVisible();
  await expect(pedido).toHaveCSS('opacity', '1');
  await expect(pedido).toHaveCSS('transform', 'none');
  await fecharSemFade(page, pedido);
});

test('os dois modais fazem fade curto ao fechar com movimento normal', async ({ page }) => {
  await neutralizarAnalytics(page);
  await page.goto('/');
  const abrirDetalhe = page.getByRole('button', { name: 'Ver detalhes de Entre Amigos' });
  await abrirDetalhe.click();
  const detalhe = page.getByRole('dialog', { name: 'Entre Amigos' });
  await expect(detalhe).toBeVisible();
  await page.waitForTimeout(300);
  await fecharComFade(page, detalhe);
  await expect(abrirDetalhe).toBeFocused();

  const abrirPedido = page.getByRole('banner').getByRole('button', { name: 'Solicitar' });
  await abrirPedido.click();
  const pedido = page.getByRole('dialog', { name: 'Vamos planejar o seu encontro?' });
  await expect(pedido).toBeVisible();
  await page.waitForTimeout(300);
  await fecharComFade(page, pedido);
  await expect(abrirPedido).toBeFocused();
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
