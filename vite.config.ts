import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 重要: define設定は書かない！
  // define: { 'process.env': {} } は削除すること
});
