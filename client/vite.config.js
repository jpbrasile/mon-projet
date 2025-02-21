import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'public', // relative to the client folder
  plugins: [react()],
  build: {
    // outDir is relative to the current root (public), so '../dist' resolves to client/dist
    outDir: '../dist',
    emptyOutDir: true,
  }
});