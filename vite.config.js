import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
 server: {
    // 👇 Esta parte es clave
    fs: {
      allow: ['.'],
    },
    // Asegura que se sirva index.html en rutas como /expense/new
    historyApiFallback: true,
  }})
