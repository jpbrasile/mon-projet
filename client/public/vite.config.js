import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'client/public',
  plugins: [react()],
  build: {
    outDir: '../dist', // This will create the build output in client/dist
    emptyOutDir: true,
  }
});