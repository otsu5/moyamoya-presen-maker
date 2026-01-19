import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // ▼▼▼ あなたのAPIキー（AIza...）に書き換えてください ▼▼▼
  const MY_API_KEY = "zaSyDPJTrPXphjcFwupObNDR7rbvciBCVs0Zg"; 
  // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

  return {
    base: './', // パス設定を相対パスに
    server: { port: 8080, host: '0.0.0.0' },
    preview: { port: 8080, host: '0.0.0.0', allowedHosts: true },
    plugins: [react()],
    define: {
      'global': 'window',
      'process.env': {},
      'process.env.API_KEY': JSON.stringify(MY_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(MY_API_KEY),
    },
    resolve: { alias: { '@': path.resolve(__dirname, '.') } }
  };
});
