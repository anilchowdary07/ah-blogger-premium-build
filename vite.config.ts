
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Add proxy for API requests to avoid CORS issues
    proxy: {
      '/.netlify/functions/server': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path,
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react-router-dom', 'sonner', '@tanstack/react-query'],
    exclude: ['framer-motion'], // Explicitly exclude problematic dependencies
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Handle specific problematic dependencies
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }
          
          // Group React core packages
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          
          // Group React Router packages
          if (id.includes('node_modules/react-router') ||
              id.includes('node_modules/react-router-dom')) {
            return 'router';
          }
          
          // Group React Query packages
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'query';
          }
          
          // Group remaining node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    // Add these settings to improve chunk handling
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true
      }
    }
  }
}));
