import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Browser talks to the Vite dev server only; the proxy forwards /api to the backend (avoids
// cross-host requests and env mismatch in Docker/CI). Override target with API_PROXY_TARGET.
const apiProxyTarget = process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:3000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // E2E in Docker uses Host: <compose_service> (e.g. frontend:5173); Vite 6+ blocks unknown hosts (403) otherwise.
    allowedHosts: true,
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
  },
})
