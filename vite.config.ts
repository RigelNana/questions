import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const isNative = process.env.ELECTRON === 'true' || process.env.CAPACITOR === 'true';
const webBase = process.env.VITE_BASE_PATH || '/questions/';

export default defineConfig({
  base: isNative ? './' : webBase,
  plugins: [react(), tailwindcss()],
})
