import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  // ▼▼▼ ここにあなたのAPIキーを貼り付けてください（ダブルクォーテーションは消さないで！） ▼▼▼
  const MY_API_KEY = "zaSyDPJTrPXphjcFwupObNDR7rbvciBCVs0Zg";
  // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

  return {
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
    define: {
      // これでアプリのどこからでもキーを呼び出せるようになります
      'process.env': {}, // エラー回避のおまじない
      'process.env.API_KEY': JSON.stringify(MY_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(MY_API_KEY),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(MY_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.')
      }
    }
  };
});
