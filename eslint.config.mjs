import tsPluginOrigin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vuePluginOrigin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

const tsPlugin = tsPluginOrigin.default || tsPluginOrigin;
const vuePlugin = vuePluginOrigin.default || vuePluginOrigin;

// Опции prettier — совпадают с .prettierrc; передаём явно, чтобы
// eslint-plugin-prettier не расходился с CLI (монорепо).
const prettierOptions = {
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 78,
};

/** @type {import('eslint').Linter.FlatConfig[]} */
const tsRec = tsPlugin.configs['flat/recommended'] || [];
/** @type {import('eslint').Linter.FlatConfig[]} */
const vueRec = vuePlugin.configs['flat/recommended'] || [];

export default [
  {
    ignores: [
      '.eslintrc.js',
      'dist',
      'node_modules',
      'public',
      'tmp',
      '**/dist/**',
      '**/node_modules/**',
      'eslint.config.mjs',
      // legacy-web — pug-шаблоны, eslint-plugin-vue их не парсит
      'packages/legacy-web/**',
      // локальные конфиги (не в git; prettier их и так пропускает)
      'server/config.js',
    ],
  },
  // JS files (server BFF, telegram-bot, конфиги, скрипты)
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { node: true, es2022: true },
    },
    plugins: { prettier },
    rules: {
      'prettier/prettier': ['warn', prettierOptions],
      '@typescript-eslint/no-require-imports': 'off',
      'no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-empty': 'off',
      'no-case-declarations': 'off',
      curly: 'warn',
      'no-console': 'off',
    },
  },
  // TS recommended + prettier (только .ts-файлы)
  ...tsRec.map((cfg) => ({
    ...cfg,
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    plugins: { ...cfg.plugins, prettier, '@typescript-eslint': tsPlugin },
    rules: {
      ...cfg.rules,
      'prettier/prettier': ['warn', prettierOptions],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  })),
  // Vue recommended (override parser)
  ...vueRec.map((cfg) => ({
    ...cfg,
    files: ['**/*.vue'],
    languageOptions: {
      ...cfg.languageOptions,
      parser: vueParser,
      parserOptions: {
        ...cfg.languageOptions?.parserOptions,
        parser: tsParser,
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      ...cfg.plugins,
      prettier,
      '@typescript-eslint': tsPlugin,
      vue: vuePlugin,
    },
    rules: {
      ...cfg.rules,
      ...tsRec.reduce((acc, c) => ({ ...acc, ...c.rules }), {}),
      'prettier/prettier': ['warn', prettierOptions],
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/attributes-order': 'off',
      'vue/require-default-prop': 'off',
      'vue/valid-v-on': 'off',
      'no-empty': 'off',
      'no-case-declarations': 'off',
    },
  })),
  // Disable all rules that conflict with Prettier
  eslintConfigPrettier,
];
