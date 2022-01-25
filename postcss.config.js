const postcssJitProps = require('postcss-jit-props')
const postcssCustomMedia = require('postcss-custom-media')
const openProps = require('open-props')

module.exports = { plugins: [postcssJitProps(openProps), postcssCustomMedia()] }
