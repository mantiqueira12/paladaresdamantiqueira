// Padrão de commits do projeto: "tipo: descrição em português" (ver AGENTS.md §8).
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'seo', 'docs', 'chore', 'test', 'refactor', 'perf', 'style', 'ci', 'build', 'revert']],
    'subject-case': [0],
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
  },
};
