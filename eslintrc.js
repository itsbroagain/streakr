module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
      'eslint:recommended',
      '@typescript-eslint/recommended',
      'react-app',
      'react-app/jest'
    ],
    ignorePatterns: ['dist', '.eslintrc.js'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh'],
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }