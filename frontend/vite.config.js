import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/dashboard/', // Adiciona o base path
  server: {
    host: 'localhost:5173',
    port: 5173,
    cors: true,
    hmr: {
      host: 'localhost:5173',
      protocol: 'ws'
    }
  }
})