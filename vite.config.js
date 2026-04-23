import { defineConfig } from 'vite';

export default defineConfig({
  base: '/tetr-command-center/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
