const { readFileSync } = require('node:fs')
const cache = '.cache/sumup/sumup-product-categories.json'

let categories = null
const getCategories = () => {
  if (categories) return categories
  try {
    console.info('%csumup cached categories', 'color:green')
    categories = JSON.parse(readFileSync(cache))
    return categories
  } catch (error) {
    console.error(
      `%cfailed to read sumup cache! [${error.message}]`,
      'color:red',
    )
    throw error
  }
}

module.exports = getCategories
