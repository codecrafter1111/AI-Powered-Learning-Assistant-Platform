import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/AI-Powered-Learning-Assistant-Platform/",
  plugins: [
    react(),
    tailwindcss(),
  ],
})