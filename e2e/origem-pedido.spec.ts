import { expect, test, type Page } from '@playwright/test';

async function preparar(page: Page) {
  // Todo destino externo é bloqueado, inclusive requisições de popups.
  await page.context().route('**/*', (route) => {
    const url = new URL(route.request().url());
    return url.hostname === 'localhost' ? route.continue() : route.abort();
  });
  await page.addInitScript(() => {
    const w = window as unknown as { __eventos: unknown[][]; gtag: (...args: unknown[]) => void };
    w.__eventos = [];
    w.gtag = (...args) => w.__eventos.push(args);
  });
}

async function eventos(page: Page) {
  return page.evaluate(() => (window as unknown as { __eventos: unknown[][] }).__eventos);
}

for (const [ponto, origem] of [
  ['header', 'landing_header'], ['hero', 'landing_hero'],
  ['band', 'landing_band'], ['footer', 'landing_footer'],
  ['', 'landing'], ['Nome Privado', 'landing'], ['toString', 'landing'], ['landing_header', 'landing'],
]) {
  test(`retorno automático preserva ${ponto || 'ponto ausente'} como ${origem}`, async ({ page }) => {
    await preparar(page);
    const params = new URLSearchParams({ pedido: '1', pagina: 'chef-particular-em-campos-do-jordao' });
    if (ponto) params.set('ponto', ponto);
    await page.goto(`/?${params}`);
    const pedido = page.getByRole('dialog', { name: 'Vamos planejar o seu encontro?' });
    await expect(pedido).toBeVisible();
    expect(await eventos(page)).toEqual([]);
    await pedido.getByLabel('Seu nome').fill('Nome Sigiloso');
    await pedido.getByLabel('Quantidade de convidados').fill('37');
    await pedido.getByLabel('Horário desejado').fill('18:30');
    await pedido.locator('form').evaluate((form) => {
      form.addEventListener('submit', (event) => event.preventDefault(), { capture: true });
    });
    await pedido.getByRole('button', { name: 'Abrir no WhatsApp' }).click();
    await expect(pedido.getByText('Se o WhatsApp abriu, revise a mensagem e toque em enviar por lá.')).toBeVisible();
    const calls = await eventos(page);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toEqual(['event', 'solicitar_orcamento', {
      origem, experiencia: '(nao_informada)', pessoas: 'Mais de 20 pessoas',
      so_servico: false, pagina: 'chef-particular-em-campos-do-jordao', cidade: undefined, ocasiao: undefined,
    }]);
    expect(JSON.stringify(calls)).not.toMatch(/Nome Privado|Nome Sigiloso|18:30|37/);
  });
}

test('cada abertura direta e reabertura emite uma vez e só a origem', async ({ page }) => {
  await preparar(page);
  await page.goto('/');
  const abrir = page.getByRole('banner').getByRole('button', { name: 'Solicitar' });
  const pedido = page.getByRole('dialog', { name: 'Vamos planejar o seu encontro?' });
  await abrir.click();
  await expect(pedido).toBeVisible();
  expect(await eventos(page)).toEqual([['event', 'abrir_formulario', { origem: 'header' }]]);
  await pedido.getByRole('button', { name: 'Fechar', exact: true }).click();
  await expect(pedido).toBeHidden();
  await abrir.click();
  await expect(pedido).toBeVisible();
  expect(await eventos(page)).toEqual([
    ['event', 'abrir_formulario', { origem: 'header' }],
    ['event', 'abrir_formulario', { origem: 'header' }],
  ]);
});

for (const modo of ['ausente', 'erro']) {
  test(`pedido abre quando o coletor está ${modo}`, async ({ page }) => {
    await preparar(page);
    await page.goto('/');
    await page.evaluate((modo) => {
      window.gtag = modo === 'ausente' ? undefined : () => { throw new Error('bloqueado'); };
    }, modo);
    await page.getByRole('banner').getByRole('button', { name: 'Solicitar' }).click();
    await expect(page.getByRole('dialog', { name: 'Vamos planejar o seu encontro?' })).toBeVisible();
  });
}
