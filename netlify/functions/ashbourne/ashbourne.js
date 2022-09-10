const { builder } = require('@netlify/functions')
const assetsByTitle = require('../../../src/contentful/assetsByTitle')

const handler = async () => {
  try {
    const fetch = (await import('node-fetch')).default

    const time = new Date().toLocaleTimeString()
    const assets = await assetsByTitle('ashbourne')

    if (!assets || assets.length !== 1)
      throw Error(`expected single ashbourne asset`)

    const { title, description, url } = assets[0]
    let csv = await fetch(url)
    csv = await csv.text()
    console.log(`${title} ${description} fetched @${time}`)

    return {
      statusCode: 200,
      body: csv,
      headers: {
        'Content-Type': 'text/csv',
      },
      ttl: 60,
    }
  } catch (error) {
    return { statusCode: 500, body: error.message }
  }
}

module.exports.handler = builder(handler)
