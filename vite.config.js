import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      external: [
        'prop-types', // Add prop-types to external dependencies
        // Add any other external dependencies here if needed
      ]
    }
  },
  optimizeDeps: {
    include: ['prop-types'] // Ensure prop-types is included in optimization
  }
});