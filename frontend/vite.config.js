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
    },
  };
});
