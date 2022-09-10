#!/usr/bin/env node

const { statSync, readFileSync, writeFileSync } = require('node:fs')

const date = require('dayjs')

const { log } = require('@andystevenson/lib/logger')

const createCacheDir = require('./src/createCacheDir')
const toJson = require('./src/ashbourne2json')

const cacheDir = './public/cache/ashbourne'
createCacheDir(cacheDir)

const cacheFile = `${cacheDir}/ashbourne.json`
const sourceFile = './scripts/src/ashbourne.csv'

const buildCache = () => {
  try {
    let members = toJson(sourceFile)
    writeFileSync(cacheFile, JSON.stringify(members, null, 2))
    log.info('cache-ashbourne built')
  } catch (error) {
    log.error(
      `cache-ashbourne failed to build cache because [${error.message}]`,
    )
    process.exit(1)
  }
}

;(() => {
  const cacheStat = statSync(cacheFile, { throwIfNoEntry: false })
  if (!cacheStat) {
    log.info(`cache-ashbourne is empty, build required`)
    return buildCache()
  }
  const sourceStat = statSync(sourceFile)

  const cacheDate = date(cacheStat.mtime)
  const sourceDate = date(sourceStat.mtime)

  const after = sourceDate.isAfter(cacheDate)

  // if the sourceFile is newer than the cache then rebuild
  if (after) return buildCache()

  // otherwise ...
  log.info('cache-ashbourne is up to date')
})()
