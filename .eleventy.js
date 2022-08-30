const config = require('@andystevenson/lib/11ty')

module.exports = function (eleventyConfig) {
  const newConfig = config(eleventyConfig)
  return newConfig
}
