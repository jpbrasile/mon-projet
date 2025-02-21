import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'public',
  plugins: [react()],
  build: {
    // outDir is resolved relative to the root, so this places files at client/public/../dist,
    // which simplifies to client/dist.
    outDir: '../dist',
    emptyOutDir: true,
  }
});