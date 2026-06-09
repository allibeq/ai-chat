import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr(),],
  server: {
    watch: {
      ignored: ['**/dist-electron/**', '**/dist/**', '**/pocketbase/pb_data/**',  '**/pocketbase/pb_migrations/**',],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      'react-virtuoso',
      'react-markdown',
      'pocketbase',
      '@tanstack/react-query',
    ],
  },
})
