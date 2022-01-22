import { defineConfig } from 'vite'
// postcss.config.js
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
})
