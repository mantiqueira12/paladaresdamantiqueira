import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export async function importTypeScript(caminho, baseUrl) {
  const arquivo = new URL(caminho, baseUrl);
  const fonte = await readFile(fileURLToPath(arquivo), 'utf8');
  const { outputText } = ts.transpileModule(fonte, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      verbatimModuleSyntax: true,
    },
    fileName: fileURLToPath(arquivo),
  });
  const modulo = Buffer.from(`${outputText}\n//# sourceURL=${arquivo.href}`).toString('base64');
  return import(`data:text/javascript;base64,${modulo}`);
}
