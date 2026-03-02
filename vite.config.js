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
        target: 'https://localhost:7175',
        changeOrigin: true,
        secure: false,
        timeout: 60000,
        proxyTimeout: 60000,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.error('--- PROXY ERROR ---', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('--> Sending:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('<-- Received:', proxyRes.statusCode, req.url);
          });
        }
      },
      '/images': {
        target: 'https://localhost:7175',
        changeOrigin: true,
        secure: false,
        timeout: 10000,
        proxyTimeout: 10000
      },
      '/Images': {
        target: 'https://localhost:7175',
        changeOrigin: true,
        secure: false,
        timeout: 10000,
        proxyTimeout: 10000
      }
    }
  }
})
