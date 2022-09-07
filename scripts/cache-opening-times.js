#!/usr/bin/env node

const { parse } = require('node:path')
const { statSync, writeFileSync, mkdirSync } = require('node:fs')
const download = require('download')
const assetsByTitle = require('../src/contentful/assetsByTitle')
const inspect = require('@andystevenson/lib/inspect')
const date = require('dayjs')
const parseOpeningTimes = require('./src/parse-opening-times')
const createCacheDir = require('./src/createCacheDir')

const command = parse(__filename).name
inspect(command)

const cacheDir = './public/cache/opening-times'
createCacheDir(cacheDir)

const cacheRequiresRebuild = (publishedAt, url) => {
  const { base } = parse(url)
  const filename = `${cacheDir}/${base}`

  try {
    const stat = statSync(filename)
    const lastModified = date(stat.mtime)
    const after = publishedAt.isAfter(lastModified)
    return after
  } catch (error) {
    inspect(`${filename} does not exist, cache rebuild required`)
    return true
  }
}

const buildCache = async (url) => {
  const { base, name } = parse(url)
  const filename = `${cacheDir}/${base}`
  inspect(`building cache [${filename}]`)

  // first thing to do is download the file
  try {
    await download(url, cacheDir)

    // okay downloaded the file now lets parse it
    const xlsx = parseOpeningTimes(filename)
    const output = `${cacheDir}/${name}.json`
    try {
      writeFileSync(output, JSON.stringify(xlsx, null, 2))
    } catch (error) {
      inspect(
        `failed to write output file [${output}] because [${error.message}]`,
      )
      process.exit(1)
    }
  } catch (error) {
    inspect(`failed to download [${url}]`)
    process.exit(1)
  }
}

;(async () => {
  // lets get the opening times
  const assets = await assetsByTitle('opening-times')
  if (assets.length === 0) {
    inspect(`asset 'opening-times' not in contentful`)
    process.exit(1)
  }

  if (assets.length > 1) {
    inspect(`more than 1 asset in contentful with the title 'opening-times'`)
    process.exit(1)
  }

  const { url, sys } = assets[0]
  const { publishedAt } = sys

  const published = date(publishedAt)
  if (cacheRequiresRebuild(published, url)) {
    await buildCache(url)
  } else {
    inspect(`${command} is up to date`)
  }
})()
