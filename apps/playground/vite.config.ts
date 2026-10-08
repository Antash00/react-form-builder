import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
    plugins: [react()],
    resolve: {
        alias:
            command === 'serve'
                ? [
                    {
                        find: /^@antash00\/form-builder-mui$/,
                        replacement: fileURLToPath(
                            new URL('../../packages/mui/src/index.ts', import.meta.url),
                        ),
                    },
                ]
                : [],
    },
}))