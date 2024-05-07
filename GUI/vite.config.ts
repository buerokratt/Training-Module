import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: 'REACT_APP_',
  plugins: [react(), tsconfigPaths(), svgr()],
   base: '/training/', //Change this according to your reverse proxy subpath
  build: {
    outDir: './burokratt',
    target: 'es2015',
    emptyOutDir: true,
  },
  server: {
      headers: {
        "Content-Security-Policy":
          "upgrade-insecure-requests; default-src 'self'; font-src 'self' data:; img-src 'self' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; object-src 'none'; connect-src 'self' http://localhost:8080 http://localhost:8085 https://admin.dev.buerokratt.ee/chat/menu.json;",
      },
    },
  resolve: {
    alias: {
      '~@fontsource': path.resolve(__dirname, 'node_modules/@fontsource'),
      '@': `${path.resolve(__dirname, './src')}`,
    },
  },
});
