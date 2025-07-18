import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { join } from 'path'
import { homedir } from 'os'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use home directory for cache to avoid permission issues
  cacheDir: join(homedir(), '.vite-cache'),
  server: {
    port: 3000,
    strictPort: false,
    open: false
  }
})
