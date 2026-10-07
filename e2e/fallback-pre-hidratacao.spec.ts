import { expect, test, type Locator, type Page } from '@playwright/test';

async function falharImagemAntesDaHidratacao(page: Page): Promise<{ imagem: Locator; liberarBundle: () => void }> {
  let liberarBundle!: () => void;
  let bundleIniciado!: () => void;
  let liberarErroImagem!: () => void;
  const bundleLiberado = new Promise<void>((resolve) => { liberarBundle = resolve; });
  const bundleSolicitado = new Promise<void>((resolve) => { bundleIniciado = resolve; });
  const erroImagemLiberado = new Promise<void>((resolve) => { liberarErroImagem = resolve; });

  await page.route('**/assets/index-*.js', async (route) => {
    bundleIniciado();
    await bundleLiberado;
    await route.continue();
  });
  await page.route('**/portfolio/mesa-de-amigos*.webp', async (route) => {
    await erroImagemLiberado;
    await route.abort();
  });

  try {
    await page.goto('/', { waitUntil: 'commit' });
    await bundleSolicitado;
    const imagem = page.getByRole('img', { name: 'Entre Amigos' });
    await expect(imagem).toBeAttached();
    await imagem.evaluate((element) => {
      const imagem = element as HTMLImageElement;
      const janela = window as typeof window & { __imagemOriginalFalhou?: boolean };
      janela.__imagemOriginalFalhou = false;
      imagem.addEventListener('error', () => { janela.__imagemOriginalFalhou = true; }, { once: true });
    });

    liberarErroImagem();
    await page.locator('#experiencias').scrollIntoViewIfNeeded();
    await expect.poll(() => page.evaluate(() => (
      (window as typeof window & { __imagemOriginalFalhou?: boolean }).__imagemOriginalFalhou
    ))).toBe(true);
    await expect.poll(() => imagem.evaluate((element) => (element as HTMLImageElement).complete)).toBe(true);
    expect(await imagem.getAttribute('src')).toMatch(/mesa-de-amigos\.webp/);
    expect(await imagem.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBe(0);
    return { imagem, liberarBundle };
  } catch (error) {
    liberarErroImagem();
    liberarBundle();
    throw error;
  }
}

test('imagem SSR com erro antes da hidratação usa fallback depois do bundle', async ({ page }) => {
  const { imagem, liberarBundle } = await falharImagemAntesDaHidratacao(page);
  try {
    liberarBundle();
    await expect(imagem).toHaveAttribute('src', /fallback\.webp/);
    await expect.poll(() => imagem.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(imagem).not.toHaveAttribute('data-image-pending', 'true');
  } finally {
    liberarBundle();
  }
});

test('fallback que também falha encerra a espera sem repetir a requisição', async ({ page }) => {
  let requisoesFallback = 0;
  await page.route('**/portfolio/fallback.webp', async (route) => {
    requisoesFallback += 1;
    await route.abort();
  });
  const { imagem, liberarBundle } = await falharImagemAntesDaHidratacao(page);
  try {
    liberarBundle();
    await expect(imagem).toHaveAttribute('src', /fallback\.webp/);
    await expect(imagem).not.toHaveAttribute('data-image-pending', 'true');
    await expect.poll(() => imagem.evaluate((element) => (element as HTMLImageElement).complete)).toBe(true);
    expect(await imagem.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBe(0);
    expect(requisoesFallback).toBe(1);
  } finally {
    liberarBundle();
  }
});
