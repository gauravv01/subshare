import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
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
  
})
