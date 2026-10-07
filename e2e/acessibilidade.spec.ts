import { expect, test } from '@playwright/test';

const landingRoutes = [
  '/chef-particular-em-campos-do-jordao/',
  '/chef-particular-em-santo-antonio-do-pinhal/',
  '/chef-particular-em-sao-bento-do-sapucai/',
  '/chef-particular-em-monte-verde/',
  '/chef-particular-em-goncalves/',
  '/chef-particular-em-sao-jose-dos-campos/',
  '/jantar-de-reveillon-na-serra-da-mantiqueira/',
  '/jantar-de-inverno-e-fondue-na-serra-da-mantiqueira/',
  '/jantar-romantico-na-serra-da-mantiqueira/',
  '/jantar-de-bodas-e-pedido-de-casamento-na-serra-da-mantiqueira/',
  '/chef-para-pousadas-e-casas-de-temporada-na-serra-da-mantiqueira/',
  '/personal-chef-na-serra-da-mantiqueira/',
  '/chef-para-casamento-e-mini-wedding-na-serra-da-mantiqueira/',
  '/chef-para-aniversario-na-serra-da-mantiqueira/',
];

const testedRoutes = [...landingRoutes, '/404.html'];
const publicRoutes = ['/', ...testedRoutes];

test('skip link move o foco para main nas 14 landings e na página 404', async ({ page }) => {
  for (const route of testedRoutes) {
    await page.goto(route);

    const skipLink = page.getByRole('link', { name: 'Pular para o conteúdo' });
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main#conteudo')).toBeFocused();
  }
});

test('nome acessível do logotipo inclui a marca e a tagline visível', async ({ page }) => {
  for (const route of publicRoutes) {
    await page.goto(route);
    await expect(
      page.getByRole('link', { name: /Paladares da Mantiqueira.*Concierge Gastronômico/ }),
    ).toBeVisible();
  }
});

test('o rótulo Não incluso mantém contraste AA na ficha da experiência', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Ver detalhes de Entre Amigos' }).click();
  const label = page.getByText('Não incluso', { exact: true });
  await expect(label).toBeVisible();

  const ratio = await label.evaluate((element) => {
    const context = document.createElement('canvas').getContext('2d');
    if (!context) throw new Error('Canvas 2D indisponível para medir o contraste.');

    context.clearRect(0, 0, 1, 1);
    context.fillStyle = 'rgb(255 255 255)';
    context.fillRect(0, 0, 1, 1);
    const ancestors: Element[] = [];
    for (let current: Element | null = element; current; current = current.parentElement) {
      ancestors.push(current);
    }
    for (const ancestor of ancestors.reverse()) {
      const background = getComputedStyle(ancestor).backgroundColor;
      if (background !== 'rgba(0, 0, 0, 0)' && background !== 'transparent') {
        context.fillStyle = background;
        context.fillRect(0, 0, 1, 1);
      }
    }
    const background = Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3);
    context.fillStyle = getComputedStyle(element).color;
    context.fillRect(0, 0, 1, 1);
    const foreground = Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3);
    const luminance = (rgb: number[]) => {
      const linear = rgb.map((value) => {
        const channel = value / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    const lighter = Math.max(luminance(foreground), luminance(background));
    const darker = Math.min(luminance(foreground), luminance(background));
    return (lighter + 0.05) / (darker + 0.05);
  });

  expect(ratio).toBeGreaterThanOrEqual(4.5);
});

test('campos vazios e crédito de sobremesa mantêm contraste AA', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole('button', { name: 'Solicitar minha experiência' }).last().click();

  const contrast = async (locator: import('@playwright/test').Locator, pseudo?: string) => {
    return locator.evaluate((element, pseudoElement) => {
      const context = document.createElement('canvas').getContext('2d');
      if (!context) throw new Error('Canvas 2D indisponível para medir o contraste.');
      context.fillStyle = 'rgb(255 255 255)';
      context.fillRect(0, 0, 1, 1);
      const ancestors: Element[] = [];
      for (let current: Element | null = element; current; current = current.parentElement) ancestors.push(current);
      for (const ancestor of ancestors.reverse()) {
        const background = getComputedStyle(ancestor).backgroundColor;
        if (background !== 'rgba(0, 0, 0, 0)' && background !== 'transparent') {
          context.fillStyle = background;
          context.fillRect(0, 0, 1, 1);
        }
      }
      const background = Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3);
      context.fillStyle = getComputedStyle(element, pseudoElement).color;
      context.fillRect(0, 0, 1, 1);
      const foreground = Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3);
      const luminance = (rgb: number[]) => rgb.reduce((sum, value, index) => {
        const channel = value / 255;
        const linear = channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        return sum + linear * [0.2126, 0.7152, 0.0722][index];
      }, 0);
      const lighter = Math.max(luminance(foreground), luminance(background));
      const darker = Math.min(luminance(foreground), luminance(background));
      return (lighter + 0.05) / (darker + 0.05);
    }, pseudo);
  };

  const city = page.locator('#pedido-cidade');
  const name = page.locator('#pedido-nome');
  await expect(city).toBeVisible();
  await expect(name).toBeVisible();
  await expect(city).toHaveValue('');
  await expect(name).toHaveValue('');
  await expect(city).toHaveAttribute('placeholder', 'Ex.: Campos do Jordão');
  await expect(name).toHaveAttribute('placeholder', 'Como posso te chamar?');
  await city.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  const cityRatio = await contrast(city, '::placeholder');
  await name.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  const nameRatio = await contrast(name, '::placeholder');
  expect.soft(cityRatio, 'placeholder de cidade').toBeGreaterThanOrEqual(4.5);
  expect.soft(nameRatio, 'placeholder de nome').toBeGreaterThanOrEqual(4.5);

  await page.getByRole('dialog').getByRole('button', { name: 'Fechar' }).click();
  await page.getByRole('button', { name: 'Ver detalhes de Entre Amigos' }).click();
  const dialog = page.getByRole('dialog');
  const creditText = dialog.getByText(/Sobremesas por/);
  await creditText.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await expect(creditText).toBeVisible();
  await expect(creditText).toContainText('Sobremesas por Fernanda Marton Ateliê.');
  const creditRatio = await contrast(creditText);
  expect.soft(creditRatio, 'crédito das sobremesas').toBeGreaterThanOrEqual(4.5);
  const credit = dialog.getByRole('link', { name: 'Fernanda Marton Ateliê' });
  const detailDialog = page.getByRole('dialog', { name: 'Entre Amigos' });
  await expect(detailDialog).toHaveAttribute('aria-modal', 'true');
  await expect(credit).toHaveAttribute('target', '_blank');
  await credit.focus();
  await expect(credit).toBeFocused();
  const closeButton = detailDialog.getByRole('button', { name: 'Fechar' });
  await detailDialog.locator('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])').last().focus();
  await page.keyboard.press('Tab');
  await expect(closeButton).toBeFocused();
  await test.info().attach('ratios-de-contraste', {
    body: JSON.stringify({ cityPlaceholder: cityRatio, namePlaceholder: nameRatio, dessertCredit: creditRatio }, null, 2),
    contentType: 'application/json',
  });
  console.info(`Ratios WCAG: cidade=${cityRatio.toFixed(2)}:1, nome=${nameRatio.toFixed(2)}:1, crédito=${creditRatio.toFixed(2)}:1`);
});
