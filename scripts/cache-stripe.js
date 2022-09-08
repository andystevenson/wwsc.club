#!/usr/bin/env node
const { statSync, writeFileSync } = require('node:fs')
const { log } = require('@andystevenson/lib/logger')
const date = require('dayjs')

const createCacheDir = require('./src/createCacheDir')
const buildProducts = require('./src/build-stripe-products')

// make sure the cache directory exists
const cacheDir = './public/cache/stripe'
createCacheDir(cacheDir)

const cacheFile = `${cacheDir}/join.json`

const joinFile = './src/_data/join.js'
const join = require(`.${joinFile}`) // need to require it a level up

// buildCache
const buildCache = async () => {
  try {
    log.info(`building cache-stripe...`)
    const fullJoin = await buildProducts()
    writeFileSync(cacheFile, JSON.stringify(fullJoin, null, 2))
  } catch (error) {
    log.error(`failed to build cache for stripe because [${error.message}]`)
    process.exit(1)
  }
}

// check to see if src/_data/join.js is newer than the cached json equivalent
const process = async () => {
  try {
    const cacheStat = statSync(cacheFile, { throwIfNoEntry: false })
    if (!cacheStat) {
      log.info(`cache-stripe is empty, build required`)
      return await buildCache()
    }
    const joinStat = statSync(joinFile)

    const cacheDate = date(cacheStat.mtime)
    const joinDate = date(joinStat.mtime)

    const after = joinDate.isAfter(cacheDate)

    // if join.js last commit date is later than the cache we have to rebuild it
    if (after) return await buildCache()

    // otherwise...
    log.info(`cache-stripe is up to date`)
  } catch (error) {
    log.error(`failed to build cache-stripe because [${error.message}]`)
    process.exit(1)
  }
}

process()
