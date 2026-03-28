import buka from '@buka/eslint-config'
import { defineConfig } from 'eslint/config'
import globals from 'globals'

export default defineConfig([
  {
    ignores: ['dist', 'node_modules', 'coverage'],
  },
  {
    files: ['**/*.ts', '**/*.vue'],
    extends: [buka.typescript.recommended],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.config.ts', '*.config.mts', '.*.ts'],
          defaultProject: 'tsconfig.config.json',
        },
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
])
