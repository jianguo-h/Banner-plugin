module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018
  },
  env: {
    browser: true,
    es6: true
  },
  'rules': {
    '@typescript-eslint/no-var-requires': 'warn',
    '@typescript-eslint/explicit-function-return-type': ['error', {
      allowExpressions: true
    }],
    '@typescript-eslint/interface-name-prefix': 'off'
  }
}