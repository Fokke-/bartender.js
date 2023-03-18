module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: [
    'dist/**',
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-undef': 'off',
    'no-useless-escape': 'off',
    'no-unused-vars': 'off',
    'eol-last': [
      'error',
      'always',
    ],
    'indent': [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'never',
    ],
    'array-bracket-spacing': [
      'error',
      'never',
    ],
    'array-element-newline': 'off',
    'no-trailing-spaces': [
      'error',
    ],
    'no-multi-spaces': [
      'error',
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
      },
    ],
    'space-before-function-paren': [
      'error',
      'always',
    ],
    'space-in-parens': [
      'error',
      'never',
    ],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'never',
        exports: 'never',
        functions: 'never',
      },
    ],
  },
}
