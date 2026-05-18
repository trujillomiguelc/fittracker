import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/fittracker/', // replace 'fittracker' with your GitHub repo name
})
