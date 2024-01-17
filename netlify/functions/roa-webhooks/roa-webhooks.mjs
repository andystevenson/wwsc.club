import Stripe from 'stripe'

const stripe = new Stripe(process.env.ROA_STRIPE_SECRET_KEY)
// webhook handler
const webhook = process.env.ROA_STRIPE_WEBHOOK_SECRET_KEY
const success = { statusCode: 200 }

const handler = async (event) => {
  try {
    const { body, headers } = event

    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers['stripe-signature'],
      webhook,
    )

    const { type } = stripeEvent
    const { object } = stripeEvent.data

    if (type !== 'checkout.session.completed') {
      throw Error(`unexpected webhook event ${type}`)
    }
    // console.log('roa-webhooks', type, object.metadata)
    if (object.payment_status === 'paid') {
      console.log('paid', object.metadata)
      // await createAttendeePayment(object.metadata)
    } else {
      console.log('unpaid!', object.metadata, object.payment_status)
    }

    return success
  } catch (error) {
    console.error('roa-webhooks failed', error)
    return { statusCode: 500, body: error.message }
  }
}

export { handler }
