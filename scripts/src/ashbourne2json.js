const { readFileSync } = require('node:fs')
const csv = require('csv-parse/sync')

module.exports = (filename) => {
  return csv.parse(readFileSync(filename), {
    columns: true,
    skipEmptyLines: true,
    skipRecordsWithError: true,
  })
}
