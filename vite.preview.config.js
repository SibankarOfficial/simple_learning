import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  publicDir: false,
  build: {
    lib: {
      entry: 'src/preview/runner.jsx',
      name: 'SimpleLearningPreview',
      formats: ['iife'],
      fileName: () => 'preview-runtime.js',
    },
    outDir: 'public',
    emptyOutDir: false,
    minify: true,
  },
});
