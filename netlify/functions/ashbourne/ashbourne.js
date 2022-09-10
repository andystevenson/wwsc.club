const { builder } = require('@netlify/functions')

const handler = async () => {
  try {
    const time = new Date().toLocaleTimeString()
    console.log(`@${time}`)
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello @${time}` }),
      ttl: 60,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports.handler = builder(handler)
