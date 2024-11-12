import globals from 'globals';
import js from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import pluginPromise from 'eslint-plugin-promise';
import configPrettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  pluginImport.flatConfigs.errors,
  pluginImport.flatConfigs.warnings,
  pluginPromise.configs['flat/recommended'],
  configPrettier,
  {
    files: ['**/*.js'],

    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: 9,
      sourceType: 'module',
    },

    rules: {
      'no-restricted-syntax': 0,
      'no-underscore-dangle': 0,
    },
  },
];
