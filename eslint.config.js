// eslint.config.js: static code-quality check (run with `npm run lint`, also in CI).
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  { ignores: ['node_modules/**', 'loadtest/results/**', 'coverage/**'] },
  js.configs.recommended,
  {
    languageOptions: { ecmaVersion: 2023, sourceType: 'commonjs', globals: { ...globals.node } },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^next$' }], // Express error handlers need all 4 args
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  { files: ['tests/**/*.js'], languageOptions: { globals: { ...globals.node, ...globals.jest } } },
];
