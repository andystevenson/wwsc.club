const config = require('@andystevenson/11ty')

module.exports = function (eleventyConfig) {
  const newConfig = config(eleventyConfig)
  eleventyConfig.addWatchTarget('./public')
  eleventyConfig.addWatchTarget('**/*.mjs')
  eleventyConfig.addGlobalData('username', 'andystevenson')

  eleventyConfig.addFilter('decimal', function (num, length) {
    return num.toFixed(length || 2)
  })
  return newConfig
}
