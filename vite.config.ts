import eslint from '@nabla/vite-plugin-eslint'
import dts from 'vite-plugin-dts'

import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  define: { 'process.env': {} },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        assetFileNames: (_chunkInfo) => {
          return '[name][extname]'
        },
      },
    },
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Bartender',
      fileName: 'bartender',
      formats: ['es', 'umd'],
    },
  },
  plugins: [
    eslint({
      eslintOptions: {
        fix: false,
      },
    }),
    dts({
      include: ['./src/index.ts', './src/lib/**/*'],
      rollupTypes: false,
      copyDtsFiles: true,
    }),
  ],
})
