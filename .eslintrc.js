module.exports = {
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 6,
  },
  env: {
    node: true,
    browser: true,
  },
  globals: {
    browser: true,
  },
  rules: {
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-useless-escape': 'off',
    indent: [
      'error',
      2,
    ],
  },
}