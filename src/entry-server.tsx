/**
 * Entrada de servidor para a pré-renderização (SSG).
 * É compilada por `vite build --ssr` e executada pelo scripts/prerender.mjs,
 * que injeta este HTML dentro de <div id="root"> no dist/index.html.
 *
 * Renderiza exatamente a mesma árvore que o cliente hidrata (App em StrictMode),
 * para que a hidratação case sem divergências.
 */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
