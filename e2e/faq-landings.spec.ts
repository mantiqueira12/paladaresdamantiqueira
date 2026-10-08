import { expect, test } from '@playwright/test';

const PERGUNTA = 'Vocês são um personal chef / chef em casa?';
const LANDING = '/chef-particular-em-campos-do-jordao/';

test('FAQ das landings mantém pergunta acessível, estado nativo e indicador decorativo', async ({ page }) => {
  await page.goto(LANDING);

  const item = page.locator('.faq details').first();
  const summary = item.locator('summary');
  const indicador = summary.locator('.faq-indicator');

  await expect(summary).toHaveAccessibleName(PERGUNTA);
  expect(await item.evaluate((element) => (element as HTMLDetailsElement).open)).toBe(false);
  await expect(indicador).toHaveAttribute('aria-hidden', 'true');
  await expect(indicador.locator('.faq-indicator-closed')).toBeVisible();
  await expect(indicador.locator('.faq-indicator-closed')).toHaveText('+');
  await expect(indicador.locator('.faq-indicator-open')).toBeHidden();
  await expect(indicador.locator('.faq-indicator-open')).toHaveText('–');

  await summary.focus();
  await page.keyboard.press('Enter');
  expect(await item.evaluate((element) => (element as HTMLDetailsElement).open)).toBe(true);
  await expect(summary).toHaveAccessibleName(PERGUNTA);
  await expect(indicador.locator('.faq-indicator-closed')).toBeHidden();
  await expect(indicador.locator('.faq-indicator-open')).toBeVisible();
  await expect(indicador.locator('.faq-indicator-open')).toHaveText('–');

  await page.keyboard.press('Space');
  expect(await item.evaluate((element) => (element as HTMLDetailsElement).open)).toBe(false);
  await expect(indicador.locator('.faq-indicator-closed')).toBeVisible();
  await expect(indicador.locator('.faq-indicator-closed')).toHaveText('+');
  await expect(indicador.locator('.faq-indicator-open')).toBeHidden();

  const sitemap = await page.request.get(new URL('/sitemap.xml', page.url()).toString());
  const xml = await sitemap.text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(([, location]) => new URL(location).pathname)
    .filter((pathname) => pathname !== '/');
  expect(paths).toHaveLength(14);

  for (const path of paths) {
    const response = await page.request.get(new URL(path, page.url()).toString());
    expect(response.ok(), `${path} should be generated`).toBe(true);
    const html = await response.text();
    expect(html.match(/class="faq-indicator" aria-hidden="true"/g) ?? [], path).toHaveLength(5);
  }

  const notFound = await page.request.get(new URL('/404.html', page.url()).toString());
  expect(notFound.ok()).toBe(true);
  expect(await notFound.text()).not.toContain('class="faq-indicator"');
});

test('Shift+Tab desde o rodapé mantém links focados fora do cabeçalho fixo', async ({ page }) => {
  await page.goto(LANDING);
  await page.evaluate(() => document.fonts.ready);
  const linkInicial = page.locator('footer .fbar a').first();
  await linkInicial.focus();

  for (let step = 1; step <= 13; step += 1) {
    await page.keyboard.press('Shift+Tab');
    await page.waitForFunction(() => {
      const active = document.activeElement;
      if (!active) return false;
      const rect = active.getBoundingClientRect();
      const current = { x: rect.x, y: rect.y, width: rect.width, height: rect.height, scrollY: window.scrollY };
      const state = window as typeof window & { __faqFocusPrevious?: typeof current; __faqFocusStable?: number };
      const previous = state.__faqFocusPrevious;
      const same = previous && Math.abs(previous.x - current.x) < 0.25 && Math.abs(previous.y - current.y) < 0.25
        && Math.abs(previous.width - current.width) < 0.25 && Math.abs(previous.height - current.height) < 0.25
        && Math.abs(previous.scrollY - current.scrollY) < 0.25;
      state.__faqFocusStable = same ? (state.__faqFocusStable ?? 0) + 1 : 0;
      state.__faqFocusPrevious = current;
      return state.__faqFocusStable >= 4;
    });

    if (step === 12 || step === 13) {
      const esperado = step === 12 ? 'Chef particular em Gonçalves' : 'Chef particular em Monte Verde';
      const resultado = await page.evaluate(() => {
        const active = document.activeElement as HTMLElement;
        const rect = active.getBoundingClientRect();
        const header = document.querySelector('header') as HTMLElement;
        const headerRect = header.getBoundingClientRect();
        const left = Math.max(rect.left, headerRect.left);
        const right = Math.min(rect.right, headerRect.right);
        const top = Math.max(rect.top, headerRect.top);
        const bottom = Math.min(rect.bottom, headerRect.bottom);
        const overlapWidth = Math.max(0, right - left);
        const overlapHeight = Math.max(0, bottom - top);
        const hit = overlapWidth && overlapHeight
          ? document.elementFromPoint(left + overlapWidth / 2, top + overlapHeight / 2)
          : null;
        return {
          text: (active.innerText || '').trim(),
          top: rect.top,
          headerBottom: headerRect.bottom,
          overlapHeight,
          coveredByHeader: !!hit && (hit === header || header.contains(hit)),
        };
      });
      expect(resultado.text).toBe(esperado);
      expect(resultado.overlapHeight).toBe(0);
      expect(resultado.coveredByHeader).toBe(false);
      expect(resultado.top).toBeGreaterThanOrEqual(resultado.headerBottom);
    }
  }
});
