#!/usr/bin/env node

const { statSync, readFileSync, writeFileSync } = require('node:fs')
const { exit } = require('node:process')

const { log } = require('@andystevenson/lib/logger')
const date = require('dayjs')

const createCacheDir = require('./src/createCacheDir')
const { isMember } = require('./src/memberStatus')

const cacheDir = '.cache/ashbourne'
const jsonFile = `${cacheDir}/ashbourne.json`
const cacheFile = `${cacheDir}/card-check.json`

const cardCheck = async () => {
  try {
    // ensure we have somewhere to store the resource
    createCacheDir(cacheDir)

    // find out if json is alread cached...
    const jsonStat = statSync(jsonFile, { throwIfNoEntry: false })
    if (!jsonStat) throw Error(`cache-ashbourne-json needs to be run first...`)

    const cacheStat = statSync(cacheFile, { throwIfNoEntry: false })
    const jsonDate = date(jsonStat.mtime)

    const cacheOutOfDate = cacheStat
      ? jsonDate.isAfter(date(cacheStat.mtime))
      : true

    if (cacheOutOfDate) {
      try {
        const json = JSON.parse(readFileSync(jsonFile))
        const transformed = transform(json)
        // console.log({ transformed })
        writeFileSync(cacheFile, JSON.stringify(transformed))
        log.info(`cache-ashbourne-checks updated`)
        return
      } catch (error) {
        log.error(`cache-ashbourne-checks failed because [${error}]`)
      }
    }

    // otherwise we're all up to date
    log.info(`cache-ashbourne-checks up to date`)
  } catch (error) {
    log.error(`failed to cache-ashbourn-checks because [${error.message}]`)
    exit(1)
  }
}

const date2dayjs = require('./src/ashbourneDate2dayjs')

function transform(ashbourne) {
  return ashbourne.reduce((checks, member) => {
    let cardNo = member['Card No']
    cardNo = cardNo.trim() ? cardNo.trim() : null
    cardNo = cardNo === '0' ? null : cardNo

    if (cardNo) {
      const valid = isMember(member.Status.trim())
      const name = `${member['First Name'].trim()} ${member.Surname.trim()}`
      const email = member.Email.trim()
      const expired = member['Expire Date'].trim()
      const status = member.Status.trim().toLowerCase()
      let expiredDate = date2dayjs(expired)
      const displayStatus = expiredDate.isValid()
        ? `${status} ${expiredDate.format('DD/MM/YYYY')}`
        : status
      const now = date()
      const dob = date2dayjs(member.DOB)
      const age = now.diff(dob, 'years')
      log.info({ now, dob, age })
      checks[cardNo] = [valid, name, displayStatus, email, age]
    }
    return checks
  }, {})
}

cardCheck()
