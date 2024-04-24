console.log('functions/stripe-ticket')
const process = require('process')
require('dotenv').config()
let statusCode = 200
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const handler = async function (event) {
  // -- We only care to do anything if this is our POST request.
  if (event.httpMethod !== 'POST' || !event.body) {
    statusCode = 400
    return {
      statusCode,
      headers,
      body: '',
    }
  }

  // -- Parse the body contents into an object.
  const body = JSON.parse(event.body)

  // -- Make sure we have all required body. Otherwise, escape.
  if (!body.session) {
    console.error('Badly formatted session data')
    statusCode = 400
    return {
      statusCode,
      headers,
      body: JSON.stringify({ status: 'Badly formatted session data' }),
    }
  }

  try {
    // with thanks https://github.com/alexmacarthur/netlify-lambda-function-example/blob/68a0cdc05e201d68fe80b0926b0af7ff88f15802/lambda-src/purchase.js

    const price = await stripe.prices.search({
      query: "lookup_key:'true' AND metadata['order_id']:'6735'",
    })
    return { statusCode, headers, body: JSON.stringify({ price }) }
  } catch (error) {
    console.error('roa-stripe failed', { error })
    return { statusCode: 500, error: error.message }
  }
}

module.exports = { handler }
