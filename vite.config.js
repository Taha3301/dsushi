import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/dsushi/',
  plugins: [vue()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:7175', // Local backend URL for testing
        changeOrigin: true,
        secure: false, // Allow self-signed certificates
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      '/images': {
        target: 'https://localhost:7175',
        changeOrigin: true,
        secure: false
      },
      '/Images': {
        target: 'https://localhost:7175',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
