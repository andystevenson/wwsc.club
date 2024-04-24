console.log('functions/squash')
// making squash data available to all
const data = require('../../../src/_data/squash')
const handler = async (event) => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
