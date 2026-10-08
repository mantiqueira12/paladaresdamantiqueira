import { expect, test, type Locator, type Page } from '@playwright/test';

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

async function abrirPedido(page: Page) {
  await neutralizarAnalytics(page);
  await page.goto('/');
  await page.getByRole('banner').getByRole('button', { name: 'Solicitar' }).click();
  const pedido = page.getByRole('dialog', { name: 'Vamos planejar o seu encontro?' });
  await expect(pedido).toBeVisible();
  return pedido;
}

async function aguardarGeometriaEstavel(locator: Locator) {
  await locator.evaluate(async (alvo) => new Promise<void>((resolve, reject) => {
    let anterior = '';
    let quadrosEstaveis = 0;
    let quadros = 0;
    const observar = () => {
      quadros += 1;
      const dialogo = alvo.closest<HTMLElement>('[role="dialog"]');
      const retangulo = alvo.getBoundingClientRect();
      const estado = [
        window.scrollY,
        dialogo?.scrollTop ?? 0,
        retangulo.x,
        retangulo.y,
        retangulo.width,
        retangulo.height,
      ].map((valor) => Math.round(valor * 2) / 2).join(':');
      quadrosEstaveis = estado === anterior ? quadrosEstaveis + 1 : 0;
      anterior = estado;
      if (quadrosEstaveis >= 5) resolve();
      else if (quadros >= 180) reject(new Error('O foco não estabilizou dentro do diálogo.'));
      else requestAnimationFrame(observar);
    };
    requestAnimationFrame(observar);
  }));
}

async function pontoVisivelForaDasBarras(page: Page) {
  return page.evaluate(() => {
    const dialogo = document.querySelector<HTMLElement>('[role="dialog"]');
    const alvo = document.activeElement;
    if (!dialogo || !(alvo instanceof HTMLElement) || !dialogo.contains(alvo)) return false;
    const retangulo = alvo.getBoundingClientRect();
    const barras = Array.from(dialogo.querySelectorAll<HTMLElement>('*')).filter((elemento) => {
      const estilo = getComputedStyle(elemento);
      return estilo.position === 'sticky';
    });
    const cabecalho = barras.find((elemento) => getComputedStyle(elemento).top === '0px');
    const rodape = barras.find((elemento) => getComputedStyle(elemento).bottom === '0px');
    const topoScrollport = dialogo.getBoundingClientRect().top + dialogo.clientTop;
    const baseScrollport = topoScrollport + dialogo.clientHeight;
    const esquerda = Math.max(0, dialogo.getBoundingClientRect().left + dialogo.clientLeft, retangulo.left);
    const direita = Math.min(window.innerWidth, dialogo.getBoundingClientRect().right - dialogo.clientLeft, retangulo.right);
    const topo = Math.max(0, topoScrollport, retangulo.top);
    const base = Math.min(window.innerHeight, baseScrollport, retangulo.bottom);
    if (direita <= esquerda || base <= topo) return false;
    for (const fracaoX of [0.15, 0.5, 0.85]) {
      for (const fracaoY of [0.15, 0.5, 0.85]) {
        const x = esquerda + (direita - esquerda) * fracaoX;
        const y = topo + (base - topo) * fracaoY;
        const cobertoPeloCabecalho = Boolean(cabecalho && (() => {
          const barra = cabecalho.getBoundingClientRect();
          return x >= barra.left && x <= barra.right && y >= barra.top && y <= barra.bottom;
        })());
        const cobertoPeloRodape = Boolean(rodape && (() => {
          const barra = rodape.getBoundingClientRect();
          return x >= barra.left && x <= barra.right && y >= barra.top && y <= barra.bottom;
        })());
        const atingido = document.elementFromPoint(x, y);
        if (!cobertoPeloCabecalho && !cobertoPeloRodape && atingido && (atingido === alvo || alvo.contains(atingido))) return true;
      }
    }
    return false;
  });
}

async function medirFocoNoScrollport(page: Page) {
  return page.evaluate(() => {
    const dialogo = document.querySelector<HTMLElement>('[role="dialog"]');
    const alvo = document.activeElement;
    if (!dialogo || !(alvo instanceof HTMLElement) || !dialogo.contains(alvo)) return null;
    const barras = Array.from(dialogo.querySelectorAll<HTMLElement>('*')).filter((elemento) => getComputedStyle(elemento).position === 'sticky');
    const cabecalho = barras.find((elemento) => getComputedStyle(elemento).top === '0px');
    const rodape = barras.find((elemento) => getComputedStyle(elemento).bottom === '0px');
    const alvoRect = alvo.getBoundingClientRect();
    const cabecalhoRect = cabecalho?.getBoundingClientRect();
    const rodapeRect = rodape?.getBoundingClientRect();
    const scrollportTop = dialogo.getBoundingClientRect().top + dialogo.clientTop;
    const scrollportBottom = scrollportTop + dialogo.clientHeight;
    const centro = document.elementFromPoint(alvoRect.left + alvoRect.width / 2, alvoRect.top + alvoRect.height / 2);
    return {
      top: alvoRect.top,
      bottom: alvoRect.bottom,
      scrollportTop,
      scrollportBottom,
      cabecalhoBottom: cabecalhoRect?.bottom ?? scrollportTop,
      rodapeTop: rodapeRect?.top ?? scrollportBottom,
      centroAtingeAlvo: Boolean(centro && (centro === alvo || alvo.contains(centro))),
      scrollPaddingTop: getComputedStyle(dialogo).scrollPaddingTop,
      scrollPaddingBottom: getComputedStyle(dialogo).scrollPaddingBottom,
      alturaCabecalho: cabecalho?.offsetHeight ?? 0,
      alturaRodape: rodape?.offsetHeight ?? 0,
    };
  });
}

test('o foco reverso mantém os controles do pedido alcançáveis fora das barras sticky', async ({ page }) => {
  const pedido = await abrirPedido(page);
  const acao = pedido.getByRole('button', { name: 'Abrir no WhatsApp' });
  await acao.focus();
  await expect(acao).toBeFocused();

  const quantidade = pedido.getByLabel('Quantidade de convidados');
  let alcancouQuantidade = false;
  const controlesSemPontoVisivel: string[] = [];
  for (let passo = 0; passo < 36; passo += 1) {
    await page.keyboard.press('Shift+Tab');
    const ativo = page.locator('[role="dialog"] :focus');
    await expect(ativo).toHaveCount(1);
    await aguardarGeometriaEstavel(ativo);
    const id = await ativo.getAttribute('id');
    if (id === 'pedido-convidados') {
      alcancouQuantidade = true;
      break;
    }
    if (await ativo.evaluate((elemento) => !elemento.closest('form')?.contains(elemento.closest('.sticky')))) {
      if (!await pontoVisivelForaDasBarras(page)) {
        const nome = id || await ativo.evaluate((elemento) => elemento.tagName);
        controlesSemPontoVisivel.push(nome);
      }
    }
  }

  expect(alcancouQuantidade, 'a navegação reversa deve atravessar segmentos nativos e alcançar quantidade').toBe(true);
  await expect(quantidade).toBeFocused();
  if (page.viewportSize()?.width === 390) {
    const geometria = await medirFocoNoScrollport(page);
    if (!geometria) throw new Error('O diálogo precisa conter o controle focado.');
    expect(geometria.top).toBeGreaterThanOrEqual(geometria.cabecalhoBottom - 0.5);
    expect(geometria.bottom).toBeLessThanOrEqual(geometria.rodapeTop + 0.5);
    expect(geometria.centroAtingeAlvo).toBe(true);
    expect(await pontoVisivelForaDasBarras(page), 'quantidade precisa ter ponto visível fora do cabeçalho/rodapé sticky').toBe(true);
    expect(controlesSemPontoVisivel, 'nenhum controle intermediário deve ficar totalmente coberto durante o percurso').toEqual([]);

    await page.setViewportSize({ width: 390, height: 720 });
    await aguardarGeometriaEstavel(quantidade);
    await expect.poll(async () => {
      const atual = await medirFocoNoScrollport(page);
      return [atual?.scrollPaddingTop, atual?.alturaCabecalho, atual?.scrollPaddingBottom, atual?.alturaRodape];
    }).toEqual([
      `${geometria.alturaCabecalho}px`,
      geometria.alturaCabecalho,
      `${geometria.alturaRodape}px`,
      geometria.alturaRodape,
    ]);
    const aposResize = await medirFocoNoScrollport(page);
    if (!aposResize) throw new Error('O diálogo precisa conter o controle focado após o resize.');
    expect(aposResize.top).toBeGreaterThanOrEqual(aposResize.cabecalhoBottom - 0.5);
    expect(aposResize.bottom).toBeLessThanOrEqual(aposResize.rodapeTop + 0.5);
    expect(aposResize.centroAtingeAlvo).toBe(true);
  }
});

test('data inválida explica o erro, recupera foco e não abre o WhatsApp', async ({ page, context }) => {
  let requisicoesWhatsApp = 0;
  let abriuPopup = false;
  await page.route(/^https:\/\/wa\.me\//, async (route) => {
    requisicoesWhatsApp += 1;
    await route.abort();
  });
  page.on('popup', () => { abriuPopup = true; });

  const pedido = await abrirPedido(page);
  const data = pedido.getByLabel('Data desejada');
  const ontem = await data.evaluate((elemento) => {
    const input = elemento as HTMLInputElement;
    const base = new Date(`${input.min}T00:00:00Z`);
    base.setUTCDate(base.getUTCDate() - 1);
    return base.toISOString().slice(0, 10);
  });
  await data.fill(ontem);
  await pedido.getByLabel('Quantidade de convidados').fill('12');
  await pedido.getByLabel('Horário desejado').fill('19:00');

  await pedido.getByRole('button', { name: 'Abrir no WhatsApp' }).click();

  await expect(data).toHaveAccessibleName('Data desejada');
  await expect(data).toHaveAttribute('aria-invalid', 'true');
  await expect(data).toHaveAttribute('aria-describedby', 'pedido-data-erro');
  await expect(data).toHaveAccessibleDescription('Escolha hoje ou uma data futura.');
  await expect(pedido.getByRole('alert')).toHaveText('Escolha hoje ou uma data futura.');
  await expect(data).toBeFocused();
  expect(requisicoesWhatsApp).toBe(0);
  expect(abriuPopup).toBe(false);
  expect(context.pages()).toHaveLength(1);
});
