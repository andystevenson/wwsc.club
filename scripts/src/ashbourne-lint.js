const { log } = require('@andystevenson/lib/logger')
const csv = require('csv-parse/sync')
const { readFileSync } = require('node:fs')

module.exports = (filename) => {
  let ok = true
  try {
    return csv.parse(readFileSync(filename), {
      columns: true,
      relax_column_count: true,
      raw: true,
      on_record({ raw }, context) {
        if (context.error) {
          log.info(context.error.message)
          log.error(raw)
          ok = false
        }
      },
    })
  } catch (error) {
    log.error(`ashbourne-lint failed because [${error.message}]`)
    ok = false
  }
  return ok
}

// module.exports(process.argv[2])
