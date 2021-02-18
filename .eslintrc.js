module.exports = {
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 8,
  },
  env: {
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
      {
        "SwitchCase": 1,
      }
    ],
  },
}