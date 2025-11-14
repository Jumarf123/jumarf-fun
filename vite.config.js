import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        format: 'esm'
      }
    },
    modulePreload: {
      polyfill: false
    },
    target: 'esnext',
    minify: 'terser',
    sourcemap: false
  },
  server: {
    port: 3000,
    strictPort: true,
    open: true
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      loader: { '.js': 'jsx' },
      jsx: 'automatic',
      jsxImportSource: 'react'
    }
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: []
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  define: {
    'process.env': {}
  }
})
