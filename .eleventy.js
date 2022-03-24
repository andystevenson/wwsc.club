const config = require('@andystevenson/11ty')

module.exports = function (eleventyConfig) {
  const newConfig = config(eleventyConfig)
  eleventyConfig.addWatchTarget('./public')
  eleventyConfig.addFilter('decimal', function (num, length) {
    return num.toFixed(length || 2)
  })
  return newConfig
}
