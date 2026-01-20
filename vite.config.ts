import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: './',
    server: {
      port: 8080,
      host: '0.0.0.0',
    },
    preview: {
      port: 8080,
      host: '0.0.0.0',
      allowedHosts: true
    },
    plugins: [react()],
    // ▼▼▼ この部分がないとビルドで落ちます。復活させました。 ▼▼▼
    define: {
      'global': 'window',
      'process.env': {},
    },
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.')
      }
    }
  };
});
