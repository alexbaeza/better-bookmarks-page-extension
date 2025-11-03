/// <reference types="vite/client" />
// biome-ignore lint/correctness/noUndeclaredDependencies: Optional dev dependency
import { codecovVitePlugin } from '@codecov/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'build',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      input: './index.html',
      output: {
        manualChunks: (id) => {
          // Split vendor chunks for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('jotai')) {
              return 'state-vendor';
            }
            if (id.includes('@floating-ui') || id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }
            return 'vendor';
          }
        },
        compact: true,
      },
    },
    reportCompressedSize: false,
    chunkSizeWarningLimit: 600,
  },
  plugins: [
    react({
      jsxImportSource: 'react',
      jsxRuntime: 'automatic',
    }),
    // Put the Codecov vite plugin after all other plugins
    codecovVitePlugin({
      bundleName: 'better-bookmarks-page-extension',
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
  resolve: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
      '~test': new URL('./test/unit', import.meta.url).pathname,
    },
  },
  server: {
    port: 3000,
  },
});
