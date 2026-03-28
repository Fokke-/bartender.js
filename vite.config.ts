import dts from 'vite-plugin-dts'

import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  define: { 'process.env': {} },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
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
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'Bartender',
      fileName: 'bartender',
      formats: ['es', 'umd'],
    },
  },
  plugins: [
    dts({
      include: ['./src/index.ts', './src/lib/**/*'],
      tsconfigPath: './tsconfig.json',
      rollupTypes: false,
      copyDtsFiles: true,
    }),
  ],
})
