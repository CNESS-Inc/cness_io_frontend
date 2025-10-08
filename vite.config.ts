import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@fortawesome/fontawesome-svg-core': '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons': '@fortawesome/free-solid-svg-icons',
      '@fortawesome/react-fontawesome': '@fortawesome/react-fontawesome',
    },
  },

  build: {
    // ✅ Tell Vite/ESBuild to target modern browsers (no old polyfills)
    target: 'es2017',           // or 'esnext' if you don’t support very old browsers
    modulePreload: true,
    minify: 'esbuild',

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
