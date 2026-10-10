import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Dev only: proxy /api → backend. Production uses VITE_API_URL (see src/api/config.ts).
    proxy: {
      '/api': {
        target: 'http://172.16.9.47:8000',
        changeOrigin: true,
      },
    },
  },
})
