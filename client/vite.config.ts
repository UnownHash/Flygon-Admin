import { resolve } from 'path'

import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    checker({
      overlay: {
        initialIsOpen: false,
      },
      typescript: {
        tsconfigPath: resolve(__dirname, 'tsconfig.json'),
      },
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
    }),
  ],
  publicDir: 'public',
  resolve: {
    alias: {
      '@components': resolve(__dirname, './src/components'),
      '@features': resolve(__dirname, './src/features'),
    },
  },
  esbuild: {
    legalComments: 'none',
  },
  build: {
    target: ['safari11.1', 'chrome64', 'firefox66', 'edge88'],
    outDir: resolve(__dirname, '../dist'),
    sourcemap: mode === 'development',
    minify: mode === 'development' ? false : 'esbuild',
    input: { main: resolve(__dirname, 'index.html') },
    assetsDir: '',
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    open: true,
    port: 7778,
    fs: {
      strict: false,
    },
    proxy: {
      '/api': {
        target: `http://0.0.0.0:7777`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
}))
