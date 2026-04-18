import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI & charting libraries (heavy, but used on multiple pages)
          'charts': ['recharts'],
          // Map library — only used in Dashboard
          'map': ['react-leaflet', 'leaflet'],
          // PDF export — only triggered on-demand
          'pdf': ['jspdf'],
          // Date picker — used in Dashboard
          'datepicker': ['react-datepicker'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://aqaariq.com/marketplace/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
