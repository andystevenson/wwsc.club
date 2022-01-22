import { resolve } from 'path'
import { defineConfig } from 'vite'
import postcssJitProps from 'postcss-jit-props'
import postcssCustomMedia from 'postcss-custom-media'

import OpenProps from 'open-props'

export default defineConfig({
  // ...
  css: {
    postcss: {
      plugins: [postcssJitProps(OpenProps), postcssCustomMedia()],
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        a404: resolve(__dirname, '404.html'),
      },
    },
  },
})
