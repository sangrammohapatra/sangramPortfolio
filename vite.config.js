import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: { outDir: 'build' },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // In dev: /api/chat → Vercel dev server running on port 3001
      // Run `vercel dev` in a second terminal for local proxy testing.
      // Without this, the widget falls back gracefully to the error message.
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
