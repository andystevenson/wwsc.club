#!/usr/bin/env node

const { statSync, writeFileSync } = require('node:fs')
const date = require('dayjs')
const createCacheDir = require('./src/createCacheDir')

// make sure the cache directory exists
const cacheDir = './public/cache/sumup'
createCacheDir(cacheDir)

const cacheFile = `${cacheDir}/sumup-product-categories.json`

const buildProductCategories = async () => {
  try {
    const goodtill = await import('@andystevenson/goodtill/category')
    const { categorize } = goodtill
    let categories = await categorize()
    return categories
  } catch (error) {
    console.error(
      `failed building sumup product categories because [${error.message}]`,
    )
    process.exit(1)
  }
}

// buildCache
const buildCache = async () => {
  try {
    console.log(`building cache-sumup...`)
    const categories = await buildProductCategories()
    writeFileSync(cacheFile, JSON.stringify(categories, null, 2))
  } catch (error) {
    console.error(`failed to build cache for sumup because [${error.message}]`)
    process.exit(1)
  }
}

// if the cache is a day old then rebuild it
const process = async () => {
  try {
    const cacheStat = statSync(cacheFile, { throwIfNoEntry: false })
    if (!cacheStat) {
      console.info(`cache-sumup is empty, build required`)
      return await buildCache()
    }

    const cacheDate = date(cacheStat.mtime)
    const now = date()

    const after = now.isAfter(cacheDate, 'day')

    // if cache is a day older then rebuild it
    if (after) return await buildCache()
    console.info(`cache-sumup is up to date`)
  } catch (error) {
    console.error(`failed to build cache-sumup because [${error.message}]`)
    process.exit(1)
  }
}

process()
