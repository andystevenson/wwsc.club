const x = require('stripe')
const env = require('../../../src/js//stripeEnv.js')
const { stripe, webhook } = env

const https = require('https')
// const axios = require('axios').default.create({
//   httpsAgent: new https.Agent({ keepAlive: true }),
// })

const axios = require('axios')
const emailService = `${process.env.URL}/.netlify/functions/email`

const token = require('../../../src/js/authorization-token')
async function sendMail(subject, html) {
  console.log('sendMail')
  try {
    await axios({
      url: emailService,
      method: 'POST',
      data: { subject, html },
      headers: { authorization: token },
    })
    console.log('sendMail done')
  } catch (error) {
    console.log('sendMail error', { error })
  }
}

// chargeSucceededHtml (data)
function chargeSucceededHtml(data) {
  const amount = data.amount / 100
  let { name, email, line1, line2, city, postal_code } = data.billing_details
  name ||= ''
  email ||= ''
  line1 ||= ''
  line2 ||= ''
  city ||= ''
  postal_code ||= ''
  const html = `
  <h1>Stripe Charge Succeeded</h1>
  <p>${name}</p>
  <p>${email}</p>
  <p>${line1}</p>
  <p>${line2}</p>
  <p>${city}</p>
  <p>${postal_code}</p>
  <h2>Receipt</h2>
  <p>Amount <strong>£${amount.toFixed(2)}</strong> by ${
    data.payment_method_details.type
  }</p>
  <p>${data.receipt_url}</p>
  `
  return html
}

// customer.subscription.succeeded
async function subscriptionSucceededHtml(data) {
  const amount = data.plan.amount / 100
  const product = data.plan.nickname
    .replace(/-.*/, '')
    .replace(/^\w/, (c) => c.toUpperCase())
  const interval = data.plan.interval === 'month' ? 'Monthly' : 'Yearly'

  let html = `
  <h1>Subscription Succeeded</h1>
  <p><strong>${product} ${interval}</strong></p>
  <p>Amount <strong>£${amount.toFixed(2)}</strong></p>
  `
  try {
    const customer = await stripe.customers.retrieve(data.customer)
    let { name, email, phone } = customer
    let { line1, line2, city, postal_code } = customer.address
    name ||= ''
    email ||= ''
    line1 ||= ''
    line2 ||= ''
    city ||= ''
    postal_code ||= ''
    phone ||= ''
    html += `
    <p>${name}</p>
    <p>${email}</p>
    <p>${line1}</p>
    <p>${line2}</p>
    <p>${city}</p>
    <p>${postal_code}</p>
    <p>${phone}</p>
    `
  } catch (error) {
    html += `<h3>ERROR</h3>
    <p><strong>${error.message}</strong></p>
    `
  }

  return html
}

// checkout.sessions.completed

async function checkoutSessionCompleted(data) {
  const { id } = data

  console.log('checkout.sessions.completed', { data })
  let html = `
  <h1>Checkout Succeeded</h1>
  `
  try {
    const session = await stripe.checkout.sessions.retrieve(id, {
      expand: ['customer', 'line_items'],
    })
    console.log('checkout.sessions.completed', { session })

    let { mode, payment_status, custom_fields } = session

    html += `
      <strong>${mode}</strong>
      <p>${payment_status}</p>
      <hr>`

    let { name, email, phone } = session.customer
    let { line1, line2, city, postal_code } = session.customer.address
    let line_items = session.line_items.data

    name ||= ''
    email ||= ''
    line1 ||= ''
    line2 ||= ''
    city ||= ''
    postal_code ||= ''
    phone ||= ''
    html += `
    <p>${name}</p>
    <p>${email}</p>
    <p>${line1}</p>
    <p>${line2}</p>
    <p>${city}</p>
    <p>${postal_code}</p>
    <p>${phone}</p>
    `

    if (custom_fields) {
      for (const field of custom_fields) {
        const { label, text } = field
        const template = `<strong>${label}</strong><span>${text.value}</span><hr>`
        html += template
      }
    }

    for (const item of line_items) {
      let { description, amount_total, currency, price, quantity } = item
      const { unit_amount, nickname } = price
      const template = `
      <strong>${description}</strong>
      <p>${+amount_total / 100} ${currency}</p>
      <p>${+unit_amount / 100} ${currency} x ${quantity}</p>
      <p>${nickname}</p>
      <hr>
      `
      html += template
    }
  } catch (error) {
    html += `<h3>ERROR</h3>
    <p><strong>${error.message}</strong></p>
    `
  }
  return html
}
// webhook handler
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

    if (type === 'charge.succeeded') {
      console.log(' >>>>> charge.succeeded <<<<')
      await sendMail('charge.succeeded', chargeSucceededHtml(object))
      return success
    }

    if (type === 'customer.subscription.created') {
      console.log(' >>>>> customer.subscription.created <<<<')
      await sendMail(
        'customer.subscription.created',
        await subscriptionSucceededHtml(object),
      )
      return success
    }

    if (type == 'checkout.session.completed') {
      console.log(' >>>>> checkout.session.created <<<<')

      await sendMail(
        'checkout.session.completed',
        await checkoutSessionCompleted(object),
      )
      return success
    }

    return success
  } catch (error) {
    console.log(error.message)
    return { statusCode: 500, body: error.message }
  }
}

module.exports = { handler }
