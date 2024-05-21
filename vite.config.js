// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// const reactRefresh = require('@vitejs/plugin-react-refresh');
// const reactSvgPlugin = require('vite-plugin-react-svg');
// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react(), reactRefresh(), reactSvgPlugin()]
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import reactSvgPlugin from 'vite-plugin-react-svg';
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), reactSvgPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: path.join(__dirname, "_static")
  }
});
