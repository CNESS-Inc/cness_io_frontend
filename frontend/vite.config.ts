import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Ensure Vite knows these are packages, not relative files
      '@fortawesome/fontawesome-svg-core': '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons': '@fortawesome/free-solid-svg-icons',
      '@fortawesome/react-fontawesome': '@fortawesome/react-fontawesome',
    },
  },
  server: {
    port: 3000,    
    host: '0.0.0.0',
    strictPort: true,
    allowedHosts: ['f0295bbb-572d-4a52-b809-f11cdfaf3fa0.preview.emergentagent.com', 'localhost', 'https://github.com/cnessviji/cness_io_frontend_foremergent/blob/new/', 'cness-social.preview.emergentagent.com'],
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
      interval: 300,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          vendor: ['lodash', 'date-fns'],
        },
      },
    },
  },
})
