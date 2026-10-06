import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { EXPERIENCIAS, LINHAS } from '../../src/data/experiencias';

const ROOT = resolve(import.meta.dirname, '../..');
const ARQUIVOS_PUBLICOS = ['experiencias.json', 'faq.json', 'cidades.json', 'nichos.json', 'sazonais.json'];
const PROIBIDAS = ['buffet', 'rodízio', 'rodizio', 'quilo', 'marmita', 'porção', 'porcao', 'coffee break', 'evento corporativo'];

function textos(valor: unknown, acumulado: string[] = []): string[] {
  if (typeof valor === 'string') acumulado.push(valor);
  else if (Array.isArray(valor)) for (const item of valor) textos(item, acumulado);
  else if (valor && typeof valor === 'object') {
    for (const item of Object.values(valor)) textos(item, acumulado);
  }
  return acumulado;
}

const textosPublicos = ARQUIVOS_PUBLICOS.flatMap((arquivo) =>
  textos(JSON.parse(readFileSync(resolve(ROOT, 'src/data', arquivo), 'utf8'))).map((texto) => ({ arquivo, texto })),
);

describe('guardas das decisões fechadas da vitrine', () => {
  it.each(PROIBIDAS)('não inclui o termo proibido "%s" no catálogo ou páginas de SEO', (termo) => {
    const re = new RegExp(`(?<![\\p{L}])${termo}(?![\\p{L}])`, 'iu');
    const ocorrencias = textosPublicos.filter(({ texto }) => re.test(texto)).map(({ arquivo, texto }) => `${arquivo}: ${texto.slice(0, 100)}`);
    expect(ocorrencias).toEqual([]);
  });

  it('não publica valores monetários nos dados de catálogo ou landings', () => {
    const valores = textosPublicos.flatMap(({ arquivo, texto }) =>
      [...texto.matchAll(/R\$\s*[\d.,]+/gi)].map((match) => `${arquivo}: ${match[0]}`),
    );
    expect(valores).toEqual([]);
  });

  it('mantém exatamente as três portas de ocasião aprovadas', () => {
    expect([...LINHAS].sort()).toEqual(['Casa Cheia', 'Celebração', 'Íntima']);
    for (const experiencia of EXPERIENCIAS) expect(LINHAS).toContain(experiencia.linha);
  });

  it('mantém slugs únicos e capas para todas as experiências ativas', () => {
    const slugs = EXPERIENCIAS.map(({ slug }) => slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const experiencia of EXPERIENCIAS.filter(({ ativo }) => ativo)) {
      expect(experiencia.promessa.length, experiencia.slug).toBeGreaterThan(10);
      expect(experiencia.cardapio.length, experiencia.slug).toBeGreaterThan(0);
      expect(existsSync(resolve(ROOT, 'public', experiencia.imagem.replace(/^\//, ''))), experiencia.imagem).toBe(true);
    }
  });
});
