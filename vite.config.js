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
      '/api/send-contact-email': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: 'https://dsushi-be.onrender.com',
        changeOrigin: true,
        secure: false, // Allow self-signed certificates
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      '/images': {
        target: 'https://dsushi-be.onrender.com',
        changeOrigin: true,
        secure: false
      },
      '/Images': {
        target: 'https://dsushi-be.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
