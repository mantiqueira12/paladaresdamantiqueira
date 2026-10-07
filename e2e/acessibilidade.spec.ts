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
