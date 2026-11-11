import eslint from '@eslint/js';
import vue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

/**
 * Shared flat config. Rules live next to the workspace configuration so every
 * app gets the same baseline regardless of which package invokes ESLint.
 */
export default [
  {
    ignores: ['**/dist/**', '**/coverage/**', '**/node_modules/**', '**/.vite/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx,vue}'],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { disallowTypeAnnotations: false, fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // Prettier owns Vue line wrapping and self-closing style.
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/singleline-html-element-content-newline': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
];
