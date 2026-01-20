import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    // 1. ルート直下のファイルを正しくビルドするためのベース設定
    base: './',
    // 2. Cloud Runの要件（ポート8080）
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
    resolve: {
      // 3. ルートディレクトリを @ として参照できるようにする
      alias: {
        '@': path.resolve(__dirname, '.')
      }
    }
  };
});
