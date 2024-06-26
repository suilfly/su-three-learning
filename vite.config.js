import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import glsl from 'vite-plugin-glsl'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), glsl()],
  server: {
    host: '127.0.0.1',
    hmr: {
      host: '127.0.0.1',
    },
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src/assets'),
      },
    ],
  },
});
