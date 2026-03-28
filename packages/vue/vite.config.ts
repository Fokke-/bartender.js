import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  define: { 'process.env': {} },
  build: {
    target: 'esnext',
    sourcemap: true,
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'VueBartender',
      fileName: 'vue-bartender',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', '@fokke-/bartender.js'],
    },
  },
  plugins: [
    vue(),
    dts({
      include: ['./src/index.ts', './src/lib/**/*'],
      tsconfigPath: './tsconfig.json',
      rollupTypes: false,
      copyDtsFiles: true,
    }),
  ],
})
