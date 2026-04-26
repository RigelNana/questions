import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const isNative = process.env.ELECTRON === 'true' || process.env.CAPACITOR === 'true';

export default defineConfig({
  base: isNative ? './' : '/questions/',
  plugins: [react(), tailwindcss()],
})
