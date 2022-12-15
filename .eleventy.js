const config = require('@andystevenson/lib/11ty')
const { log } = require('@andystevenson/lib/logger')
const shortcodes = require('./src/shortcodes/shortcodes')
const info = require('./src/js/info')
const EleventyVitePlugin = require('@11ty/eleventy-plugin-vite')

const vite = {
  viteOptions: {
    assetsInclude: ['**/*.xml'],
    resolve: {
      alias: {
        '/@input': `${process.cwd()}/src`,
      },
    },
  },
}

let assets = null
const resources = [
  'hello',
  'opening-times',
  'stripe-join',
  'beer',
  'tea-coffee',
  'soft-drinks',
  'spirits',
  'sunday-lunch',
  'wine',
]

async function wwscInfo() {
  log.info(`wwscInfo fetched = [${assets !== null}]`)
  if (assets) return assets

  assets = {}
  for await (const resource of resources) {
    log.info(`fetching ${resource}`)
    assets[resource] = await info(resource)
  }
  // const fetched = await Promise.all(
  //   resources.map(async (resource) => await info(resource)),
  // )

  // assets = Object.fromEntries(
  //   resources.map((resource, index) => [resource, fetched[index]]),
  // )

  return assets
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyVitePlugin, vite)
  const newConfig = config(eleventyConfig)
  shortcodes(eleventyConfig)
  eleventyConfig.addPassthroughCopy('./public/**')
  eleventyConfig.addGlobalData('info', wwscInfo)
  eleventyConfig.addNunjucksGlobal('everything', function () {
    return this.getVariables()
  })
  return newConfig
}
