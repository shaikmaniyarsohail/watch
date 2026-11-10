import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      // Footage masters, frame zips and extracted originals are archive
      // material — watching them breaks the dev server on Windows (EBUSY)
      // and churns nothing useful.
      ignored: ['**/videos/**', '**/.agents/**', '**/dist/**'],
    },
  },
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
  },
})
