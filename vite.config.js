// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'Wires',
      // the proper extensions will be added
      fileName: 'wires'
    },
    rollupOptions: {
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          // vue: 'WireGraph'
        }
      }
    },
    
  },
  plugins: [dts()],
})