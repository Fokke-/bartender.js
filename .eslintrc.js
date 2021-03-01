module.exports = {
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
  },
  env: {
    browser: true,
  },
  globals: {
    browser: true,
  },
  ignorePatterns: [
    'dist/**',
  ],
  rules: {
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-useless-escape': 'off',
    'eol-last': [
      'error',
      'always',
    ],
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    quotes: [
      'error',
      'single',
    ],
    semi: [
      'error',
      'never'
    ],
    'array-bracket-spacing': [
      'error',
      'never',
    ],
    'array-element-newline': [
      'error',
      'always',
    ],
    'comma-dangle': [
      'error',
      {
        arrays: 'always',
        objects: 'always',
        imports: 'never',
        exports: 'never',
        functions: 'never',
      },
    ],
    'no-trailing-spaces': [
      'error',
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
      }
    ],
    'no-multi-spaces': [
      'error',
    ],
    'space-before-function-paren': [
      'error',
      'always',
    ],
    'space-in-parens': [
      'error',
      'never',
    ],
  },
}
