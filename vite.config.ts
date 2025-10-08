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
  // ✅ Add server config here
  // server: {
  //   port: 3000,    
  //    host: '0.0.0.0',   // fixed port
  //   strictPort: true,  // error if port is taken, instead of switching
  //   hmr: {
  //     overlay: true,   // shows error overlay in browser
  //   },
  //   watch: {
  //     usePolling: true,  // improves stability, especially on macOS
  //     interval: 300,
  //   },
  // },

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
