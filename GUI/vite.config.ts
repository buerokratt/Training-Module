import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: 'REACT_APP_',
  plugins: [react(), tsconfigPaths(), svgr()],
  build: {
    outDir: './build',
    target: 'es2015',
    emptyOutDir: true,
  },
})
