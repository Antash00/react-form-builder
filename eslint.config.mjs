import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
    globalIgnores([
        '**/dist/**',
        '**/node_modules/**',
        '**/test-results/**',
        '**/playwright-report/**',
    ]),
    {
        files: ['**/*.{js,mjs,ts,tsx}'],
        extends: [js.configs.recommended, tseslint.configs.recommended],
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
        },
    },
    {
        files: ['apps/playground/src/**/*.{ts,tsx}', 'packages/mui/src/**/*.{ts,tsx}'],
        extends: [reactHooks.configs.flat.recommended],
    },
    {
        files: ['apps/playground/src/**/*.{ts,tsx}'],
        extends: [reactRefresh.configs.vite],
    },
    prettier,
])
