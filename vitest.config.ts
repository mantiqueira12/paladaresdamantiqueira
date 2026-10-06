import { defineConfig } from 'vitest/config';

// Testes unitários (rápidos, sem navegador). Os testes de ponta a ponta ficam
// em e2e/ e rodam com o Playwright (npm run test:e2e).
export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
