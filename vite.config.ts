import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: Only ONE default export. Do NOT mix with CommonJS `module.exports`.
export default defineConfig({
  plugins: [react()],
})