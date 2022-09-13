const { log } = require('@andystevenson/lib/logger')
const csv = require('csv-parse/sync')
const { readFileSync } = require('node:fs')

module.exports = (filename) => {
  try {
    return csv.parse(readFileSync(filename), {
      columns: true,
      skipEmptyLines: true,
      skipRecordsWithError: true,
    })
  } catch (error) {
    log.error(`ashbourne2json failed because [${error.message}]`)
  }
}
