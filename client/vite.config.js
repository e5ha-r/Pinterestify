import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Use 127.0.0.1 (not localhost) to match Spotify's redirect URI requirement
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://127.0.0.1:5050',
        changeOrigin: true,
      }
    }
  }
})
