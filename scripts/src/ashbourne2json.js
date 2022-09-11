const { log } = require('@andystevenson/lib/logger')
const csv = require('csv-parse/sync')

module.exports = (filename) => {
  return csv.parse(readFileSync(file), {
    columns: true,
    skipEmptyLines: true,
    skipRecordsWithError: true,
  })
}
