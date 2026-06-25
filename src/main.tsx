import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootEl = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Se o HTML veio pré-renderizado (SSG, marcado por data-prerendered no build),
// hidratamos por cima dele. Em dev — ou se o prerender não rodou — montamos do
// zero, o que limpa qualquer fallback de SEO presente no #root.
if (rootEl.dataset.prerendered === 'true') {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}
