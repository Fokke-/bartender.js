import eslint from 'vite-plugin-eslint'
import stylelint from 'vite-plugin-stylelint'
import { viteStaticCopy } from 'vite-plugin-static-copy'

import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    eslint({
      fix: false,
    }),
    stylelint({
      fix: false,
      dev: true,
      build: true,
      include: ['src/**/*.{css,scss,sass,less,styl,vue,svelte}'],
    }),
    viteStaticCopy({
      targets: [
        {
          src: './src/Bartender/styles.scss',
          dest: './',
        },
      ],
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
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
    target: 'es2015',
    lib: {
      entry: resolve(__dirname, 'src/main-lib.ts'),
      name: 'Bartender',
      fileName: 'Bartender',
    },
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
          if (chunkInfo.name === 'style.css') return 'styles.css'
        },
      },
    },
  },
})
