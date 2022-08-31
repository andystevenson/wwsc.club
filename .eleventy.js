const find = require('lodash/find')
const config = require('@andystevenson/lib/11ty')

const util = require('node:util')
const inspect = function (object, ...args) {
  console.log(util.inspect(object, undefined, null, true))
  args.forEach((arg) => console.log(util.inspect(arg, undefined, null, true)))
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter('find', find)
  eleventyConfig.addFilter('inspect', inspect)

  const newConfig = config(eleventyConfig)

  return newConfig
}
