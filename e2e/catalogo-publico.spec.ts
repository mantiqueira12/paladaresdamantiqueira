import { expect, test, type Page } from '@playwright/test';

async function bloquearSaidasExternas(page: Page) {
  await page.context().route('**/*', (route) => {
    const url = new URL(route.request().url());
    return ['localhost', '127.0.0.1'].includes(url.hostname) ? route.continue() : route.abort();
  });
}

for (const caso of [
  { pagina: 'chef-particular-em-campos-do-jordao', cidade: 'Campos do Jordão', ocasiao: '' },
  { pagina: 'jantar-de-natal-na-serra-da-mantiqueira', cidade: '', ocasiao: 'Natal na serra' },
]) {
  for (const trilha of ['direta', 'via home']) {
  test(`catálogo estático preserva contexto de ${caso.pagina} até o pedido pela trilha ${trilha}`, async ({ page }) => {
    await bloquearSaidasExternas(page);
    await page.goto(`/${caso.pagina}/`);
    if (trilha === 'via home') {
      await page.getByRole('link', { name: 'Ver as experiências', exact: true }).click();
      await page.getByRole('link', { name: 'Consultar os cardápios e as opções de cada experiência', exact: true }).click();
    } else {
      await page.locator('footer').getByRole('link', { name: 'Ver cardápios', exact: true }).click();
    }
    expect(new URL(page.url()).pathname).toBe('/cardapios/');
    await page.getByRole('link', { name: 'Conversar sobre Origens da Serra', exact: true }).click();
    const pedido = page.getByRole('dialog', { name: 'Vamos planejar o seu encontro?' });
    await expect(pedido).toBeVisible();
    await expect(pedido.getByLabel('Experiência desejada', { exact: true })).toHaveValue('Origens da Serra');
    await expect(pedido.getByLabel('Cidade / local', { exact: true })).toHaveValue(caso.cidade);
    await expect(pedido.getByLabel('Ocasião', { exact: true })).toHaveValue(caso.ocasiao);
    expect(new URL(page.url()).searchParams.get('pagina')).toBe(caso.pagina);
    // Conferir a prévia sem acionar envio ou WhatsApp.
    await expect(pedido.locator('pre')).toContainText('Origens da Serra');
    await expect(pedido.locator('pre')).toContainText(caso.cidade || caso.ocasiao);
  });
  }
}

test('catálogo estático descarta query adulterada e prevalece a experiência explícita', async ({ page }) => {
  await bloquearSaidasExternas(page);
  const params = new URLSearchParams({
    pagina: 'Identificador Privado', cidade: 'Cidade Privada', ocasiao: 'Ocasião Privada',
    pessoas: 'Pessoa Privada', experiencia: 'Noite de Fondue', nome: 'Nome Privado',
    observacoes: 'Texto Privado',
  });
  await page.goto(`/cardapios/?${params}`);
  const conversa = page.getByRole('link', { name: 'Conversar sobre Origens da Serra', exact: true });
  const destino = new URL(await conversa.getAttribute('href') || '', page.url());
  expect(destino.searchParams.get('experiencia')).toBe('Origens da Serra');
  expect([...destino.searchParams.keys()].sort()).toEqual(['experiencia', 'pedido']);
  expect(decodeURIComponent(destino.href)).not.toMatch(/Privad|Noite de Fondue/);
  await conversa.click();
  const pedido = page.getByRole('dialog', { name: 'Vamos planejar o seu encontro?' });
  await expect(pedido).toBeVisible();
  await expect(pedido.getByLabel('Experiência desejada', { exact: true })).toHaveValue('Origens da Serra');
  await expect(pedido.getByLabel('Cidade / local', { exact: true })).toHaveValue('');
  await expect(pedido.getByLabel('Ocasião', { exact: true })).toHaveValue('');
  await expect(pedido.getByLabel('Quantidade de convidados', { exact: true })).toBeEmpty();
  await expect(pedido.getByLabel('Seu nome', { exact: true })).toHaveValue('');
  await expect(pedido.locator('pre')).not.toContainText('Privad');
  expect(decodeURIComponent(page.url())).not.toMatch(/Privad|Noite de Fondue/);
});

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
  expect(new URL(page.url()).pathname).toBe('/cardapios/');
  expect(new URL(page.url()).searchParams.get('pagina')).toBe('jantar-de-natal-na-serra-da-mantiqueira');
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
