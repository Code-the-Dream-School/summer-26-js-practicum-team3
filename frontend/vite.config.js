import process from 'node:process';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
    },
    plugins: [react()],
    server: {
      port: env.VITE_PORT || 8081,
      // Fail loudly if the port is taken instead of silently moving to 8082+.
      // The backend's dev CORS allow-list is pinned to this port, so a fallback
      // port would just get its requests rejected.
      strictPort: true,
      proxy: {
        '/api': {
          target: env.VITE_TARGET,
          changeOrigin: true,
        },
      },
    },
  };
});
