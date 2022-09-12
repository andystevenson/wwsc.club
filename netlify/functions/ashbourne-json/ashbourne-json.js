const { builder } = require('@netlify/functions')
const csvSync = require('csv-parse/sync')
const token = require('../../../src/js/authorization-token')

const options = {
  columns: true,
  skipEmptyLines: true,
  skipRecordsWithError: true,
}

const rawCsv = '.netlify/builders/ashbourne'

const handler = async (event) => {
  try {
    const fetch = (await import('node-fetch')).default

    const url = new URL(event.rawUrl)
    const { origin } = url
    const source = `${origin}/${rawCsv}`
    let csv = await fetch(source, { headers: { authorization: token } })
    csv = await csv.text()
    let json = csvSync.parse(csv, options)
    json = JSON.stringify(json)

    return {
      statusCode: 200,
      body: json,
      headers: {
        'Content-Type': 'application/json',
      },
      ttl: 60,
    }
  } catch (error) {
    return { statusCode: 500, body: error.message }
  }
}

module.exports.handler = builder(handler)
