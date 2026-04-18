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
        // Use a manualChunks function to map modules to chunk names (satisfies Rollup/Vite types)
        manualChunks(id: string) {
          if (!id) return undefined;
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'react-vendor';
            if (id.includes('recharts')) return 'charts';
            if (id.includes('react-leaflet') || id.includes('leaflet')) return 'map';
            if (id.includes('jspdf')) return 'pdf';
            if (id.includes('react-datepicker')) return 'datepicker';
          }
          return undefined;
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://aqaariq.com/marketplace/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
