import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './src'),
      "@/components": "/src/components",
      "@/pages": "/src/pages",
      "@/lib": "/src/lib",
      "@/utils": "/src/utils",
      "@/styles": "/src/styles",
      "@/types": "/src/types",
      "@/hooks": "/src/hooks",
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    preserveSymlinks: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
