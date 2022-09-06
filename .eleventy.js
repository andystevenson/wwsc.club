const config = require('@andystevenson/lib/11ty')
const shortcodes = require('./src/shortcodes/shortcodes')

module.exports = function (eleventyConfig) {
  const newConfig = config(eleventyConfig)
  shortcodes(eleventyConfig)

  return newConfig
}
