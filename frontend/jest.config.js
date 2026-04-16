// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setupTests.js'], // use Vitest's setupFiles
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: [
        'src/**/*.{js,jsx}',
        '!src/main.jsx',
        '!src/index.css',
        '!src/App.css',
        '!src/assets/**'
      ]
    }
  }
});
