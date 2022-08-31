const productCategoriesCache = require('./productCategoriesCache.js')

let categories = null

const getCategories = async () => {
  // if we have already fetched them then leave it at that
  if (categories) {
    // console.log('CACHED CATEGORIES!')
    return categories
  }

  // maybe we have an up to date local cache
  categories = productCategoriesCache()
  if (categories) {
    console.log('LOCALLY CACHED CATEGORIES!')
    return categories
  }

  // okay need to go to goodtill to fetch them
  console.log('FETCHING CATEGORIES FROM GOODTILL!')

  const goodtill = await import('@andystevenson/goodtill/category')
  const { categorize } = goodtill
  categories = await categorize()

  // write the local cache
  productCategoriesCache(categories)
  return categories
}

module.exports = getCategories
