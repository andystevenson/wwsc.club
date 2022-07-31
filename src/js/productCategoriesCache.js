const fs = require('fs')
const dayjs = require('dayjs')
const { file } = require('googleapis/build/src/apis/file')
const now = dayjs()

const localCache = `${process.cwd()}/public/files/productCategoriesCache.json`

const checkLocalCache = () => {
  const stat = fs.statSync(localCache, { throwIfNoEntry: false })

  if (!stat) return null

  const fileLastModified = dayjs(stat.mtimeMs)
  const sameDay = fileLastModified.isSame(now, 'day')

  if (sameDay) {
    const file = fs.readFileSync(localCache)
    const categories = JSON.parse(file)
    return categories
  }

  return null
}

const productCategoriesCache = (categories = null) => {
  if (categories) {
    // we're writing the local cache
    const data = JSON.stringify(categories, null, 2)
    fs.writeFileSync(localCache, data)
    return categories
  }

  // otherwise we're checking to see if the local one is there
  return checkLocalCache()
}

module.exports = productCategoriesCache
