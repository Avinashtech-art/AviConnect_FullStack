import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    host: true,
  },
  define: {
    'process.env': {}
  },
  build: {
    outDir: 'dist', // 👈 Ensure output goes to /dist for Nginx to serve
    emptyOutDir: true,
  }
});
