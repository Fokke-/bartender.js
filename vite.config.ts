import eslint from 'vite-plugin-eslint'
import stylelint from 'vite-plugin-stylelint'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import dts from 'vite-plugin-dts'

import { defineConfig } from 'vite'
import { resolve } from 'path'
import {
  fileURLToPath, URL
} from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  define: { 'process.env': {} },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      external: [
        'async-await-queue',
        'ts-debounce',
      ],
      output: {
        globals: {
          'async-await-queue': 'asyncAwaitQueue',
          'ts-debounce': 'tsDebounce',
        },
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'style.css') return 'bartender.css'

          return '[name]-[hash][extname]'
        },
      },
    },
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Bartender',
      fileName: 'Bartender',
      formats: [
        'es',
      ],
    },
  },
  plugins: [
    eslint({ fix: false }),
    stylelint({
      fix: false,
      dev: true,
      build: true,
      include: [
        'src/**/*.{css,scss,sass,less,styl,vue,svelte}',
      ],
    }),
    dts({
      rollupTypes: true,
      copyDtsFiles: true,
    }),
    viteStaticCopy({
      targets: [
        {
          src: './src/assets/bartender.scss',
          dest: './',
        },
      ],
    }),
  ],
})
