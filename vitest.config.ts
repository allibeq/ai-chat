import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals:     true,
        setupFiles:  ['./src/test/setup.ts'],
    },
    resolve: {
        alias: {
            '@':          path.resolve(__dirname, './src'),
            '@features':  path.resolve(__dirname, './src/features'),
            '@lib':       path.resolve(__dirname, './src/lib'),
            '@stores':    path.resolve(__dirname, './src/stores'),
            '@pages':     path.resolve(__dirname, './src/pages'),
        },
    },
})