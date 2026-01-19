import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './public/manifest.json';
import path from 'path';

export default defineConfig({
  plugins: [react(), crx({ manifest: manifest as any })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Worker configuration at root level
  worker: {
    format: 'es', // Use ES modules instead of inlining as base64
  },
  build: {
    rollupOptions: {
      input: {
        background: 'src/background.ts',
      },
      output: {
        // Prevent code splitting that creates base64 workers
        manualChunks: undefined,
      },
    },
    // Use esbuild minifier (doesn't create obfuscated code)
    minify: 'esbuild',
    sourcemap: true,
  },
});
