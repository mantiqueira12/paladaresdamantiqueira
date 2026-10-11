import { expect, test, type Page } from '@playwright/test';

async function preparar(page: Page) {
  await page.context().route('**/*', (route) => new URL(route.request().url()).hostname === 'localhost' ? route.continue() : route.abort());
  await page.addInitScript(() => {
    const w = window as unknown as { __eventos: unknown[][]; gtag: (...args: unknown[]) => void };
    w.__eventos = [];
    w.gtag = (...args) => w.__eventos.push(args);
  });
}
async function eventos(page: Page) {
  return page.evaluate(() => (window as unknown as { __eventos: unknown[][] }).__eventos);
}
const casos = [
  { slug: 'chef-particular-em-campos-do-jordao', cidade: 'Campos do Jordão', ocasiao: '' },
  { slug: 'chef-para-aniversario-na-serra-da-mantiqueira', cidade: '', ocasiao: 'Aniversário' },
];
for (const caso of casos) {
  test(`catálogo conserva contexto de ${caso.slug} sem abrir pedido automaticamente`, async ({ page }) => {
    await preparar(page);
    await page.goto(`/${caso.slug}/`);
    // O link real deve conduzir até o pedido posterior, sem substituí-lo por um URL artificial.
    await page.getByRole('link', { name: 'Ver as experiências', exact: true }).click();
    const pedido = page.getByRole('dialog', { name: 'Vamos planejar o seu encontro?' });
    await expect(page.getByRole('button', { name: 'Ver detalhes de Entre Amigos' })).toBeVisible();
    await expect(pedido).toBeHidden();
    expect(await eventos(page)).toEqual([]);
    await page.getByRole('button', { name: 'Ver detalhes de Entre Amigos' }).click();
    await page.getByRole('dialog', { name: 'Entre Amigos' }).getByRole('button', { name: 'Solicitar esta experiência' }).click();
    await expect(pedido).toBeVisible();
    await expect(pedido.getByLabel('Cidade / local')).toHaveValue(caso.cidade);
    await expect(pedido.getByLabel('Ocasião')).toHaveValue(caso.ocasiao);
    await expect(pedido.getByLabel('Experiência desejada')).toHaveValue('Entre Amigos');
    await expect(pedido.locator('pre')).toContainText('Entre Amigos');
    if (caso.cidade) await expect(pedido.locator('pre')).toContainText(caso.cidade);
    if (caso.ocasiao) await expect(pedido.locator('pre')).toContainText(caso.ocasiao);
    await pedido.locator('form').evaluate((form) => form.addEventListener('submit', (event) => event.preventDefault(), { capture: true }));
    await pedido.getByRole('button', { name: 'Abrir no WhatsApp' }).click();
    expect(await eventos(page)).toEqual([
      ['event', 'abrir_formulario', { origem: 'card_experiencia' }],
      ['event', 'solicitar_orcamento', { origem: 'card_experiencia', experiencia: 'Entre Amigos', cidade: caso.cidade || undefined, ocasiao: caso.ocasiao || undefined, pessoas: undefined, so_servico: false, pagina: caso.slug }],
    ]);
  });
}

test('contexto inválido é normalizado e escolha explícita prevalece sobre experiência anterior', async ({ page }) => {
  await preparar(page);
  const params = new URLSearchParams({ pagina: 'Identificador Privado', cidade: 'Cidade Privada', ocasiao: 'Ocasião Privada', experiencia: 'Noite de Fondue', pessoas: 'Identificador Privado' });
  await page.goto(`/?${params}#experiencias`);
  const pedido = page.getByRole('dialog', { name: 'Vamos planejar o seu encontro?' });
  await expect(page.getByRole('button', { name: 'Ver detalhes de Entre Amigos' })).toBeVisible();
  await expect(pedido).toBeHidden();
  await page.getByRole('banner').getByRole('button', { name: 'Solicitar' }).click();
  await expect(pedido.getByLabel('Experiência desejada')).toHaveValue('Noite de Fondue');
  await expect(pedido.getByLabel('Ocasião')).toHaveValue('Outra ocasião');
  await pedido.getByRole('button', { name: 'Fechar', exact: true }).click();
  await page.getByRole('button', { name: 'Ver detalhes de Entre Amigos' }).click();
  await page.getByRole('dialog', { name: 'Entre Amigos' }).getByRole('button', { name: 'Solicitar esta experiência' }).click();
  await expect(pedido.getByLabel('Experiência desejada')).toHaveValue('Entre Amigos');
  await pedido.locator('form').evaluate((form) => form.addEventListener('submit', (event) => event.preventDefault(), { capture: true }));
  await pedido.getByRole('button', { name: 'Abrir no WhatsApp' }).click();
  const calls = await eventos(page);
  expect(calls).toHaveLength(3);
  expect(calls[2]).toEqual(['event', 'solicitar_orcamento', { origem: 'card_experiencia', experiencia: 'Entre Amigos', cidade: '(outra)', ocasiao: 'Outra ocasião', pessoas: undefined, pagina: undefined, so_servico: false }]);
  expect(JSON.stringify(calls)).not.toMatch(/Privad/);
});
