import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: "/AI-Powered-Learning-Assistant-Platform/",
  plugins: [
    react(),
    tailwindcss(),
  ],
})