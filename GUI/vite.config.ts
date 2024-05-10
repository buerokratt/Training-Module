import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return defineConfig({
    envPrefix: 'REACT_APP_',
    plugins: [react(), tsconfigPaths(), svgr()],
    base: '/training/', //Change this according to your reverse proxy subpath
    define: {
      'process.env': process.env,
    },
    server: {
      headers: {
        ...(process.env.REACT_APP_CSP && {
          'Content-Security-Policy': process.env.REACT_APP_CSP,
        }),
      },
    },
    build: {
      outDir: './build',
      target: 'es2015',
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '~@fontsource': path.resolve(__dirname, 'node_modules/@fontsource'),
        '@': `${path.resolve(__dirname, './src')}`,
      },
    },
  });
};
