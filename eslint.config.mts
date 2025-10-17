// eslint.config.mts
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
// @ts-ignore - eslint-plugin-react-native não tem tipos
import reactNative from 'eslint-plugin-react-native';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  // Configuração base JavaScript
  js.configs.recommended,

  // Configuração para arquivos JavaScript (CommonJS)
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        exports: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },

  // Configuração PRINCIPAL para TypeScript e React Native
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-native': reactNative,
      '@typescript-eslint': typescript,
    },
    rules: {
      // ASPAS - Aspas simples
      'quotes': ['error', 'single'],
      'jsx-quotes': ['error', 'prefer-single'],
      
      // PONTO E VÍRGULA - Sempre no final
      'semi': ['error', 'always'],
      'semi-style': ['error', 'last'],
      'semi-spacing': ['error', { 'before': false, 'after': true }],
      
      // TEMPLATE LITERALS - Forçar crase quando possível
      'prefer-template': 'error',
      'template-curly-spacing': ['error', 'never'],
      'no-useless-concat': 'error',
      
      // React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      
      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // TypeScript
      '@typescript-eslint/no-unused-vars': [
        'error',
        { 
          'varsIgnorePattern': '^_',
          'argsIgnorePattern': '^_',
          'caughtErrorsIgnorePattern': '^_'
        }
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      
      // React Native
      'react-native/no-unused-styles': 'error',
      'react-native/split-platform-components': 'error',
      'react-native/no-inline-styles': 'off',
      'react-native/no-color-literals': 'off',
      'react-native/no-raw-text': 'warn',
      
      // Estilo de código
      'indent': ['error', 4],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'comma-spacing': ['error', { 'before': false, 'after': true }],
      'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Configuração para JavaScript (JSX)
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-native': reactNative,
    },
    rules: {
      'quotes': ['error', 'single'],
      'jsx-quotes': ['error', 'prefer-single'],
      'semi': ['error', 'always'],
      'prefer-template': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-native/no-unused-styles': 'error',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',
    },
  },

  // Ignorar arquivos desnecessários
  {
    ignores: [
      'node_modules/',
      'android/',
      'ios/',
      'build/',
      'dist/',
      'coverage/',
      '.expo/',
      '**/*.d.ts',
      'metro.config.js',
    ],
  },
];