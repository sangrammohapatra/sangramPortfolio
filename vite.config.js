import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // If deploying to a subdirectory, set base: '/your-repo-name/'
  base: '/',
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
    open: true,
  },
})
