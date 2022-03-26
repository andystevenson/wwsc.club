const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY)

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const webhookSecret =
  'whsec_45faa8e0dbd6afd7185f2e81a811b7a407bc99ee5404698cab4af6df8ecec705'

const handler = async (event) => {
  try {
    const { body, headers } = event

    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers['stripe-signature'],
      webhookSecret,
    )

    const { type } = stripeEvent
    if (type === 'invoice.created') {
      console.log('invoice.created', stripeEvent.data.object)
    }

    return {
      statusCode: 200,
      // body: JSON.stringify({ message: `Hello ${subject}` }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    console.log(error.message)
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
