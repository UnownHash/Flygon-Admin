import { resolve } from 'path'
import fs from 'fs'

import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'
import toml from 'toml'

interface Config {
  general: {
    host: string
    port: number
    username: string
    password: string
    flygon: {
      api_endpoint: string
      api_secret: string
    }
    golbat: {
      api_endpoint: string
      api_secret: string
    }
  }
}
export default defineConfig(({ mode }) => {
  const config: Config = fs.existsSync(resolve(__dirname, '../config.toml'))
    ? toml.parse(fs.readFileSync(resolve(__dirname, '../config.toml'), 'utf-8'))
    : {}
  const host = config?.general?.host || '0.0.0.0'
  const port = config?.general?.port || 9003

  return {
    plugins: [
      react(),
      splitVendorChunkPlugin(),
      ...(mode === 'development'
        ? [
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
          ]
        : []),
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
      host,
      open: true,
      port: port + 1,
      fs: {
        strict: false,
      },
      proxy: {
        '/api': {
          target: `http://${host}:${port}`,
          changeOrigin: true,
          secure: false,
        },
        '/auth': {
          target: `http://${host}:${port}`,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
