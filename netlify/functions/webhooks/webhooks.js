const x = require('stripe')
const env = require('../../../src/js//stripeEnv.js')
const { stripe, webhook } = env

// email handling ... TODO: split this into its own function
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const auth = new OAuth2(env.emailClientId, env.emailClientSecret)
auth.setCredentials({ refresh_token: env.emailRefreshToken })

const options = {
  from: `CLUB WEBSITE <${env.emailUser}>`,
  to: env.emailRecipient,
  subject: 'WWSC test email',
  html: '<h1>WWSC test email</h1>',
}

async function sendMail(subject, message) {
  console.log('sendMail', { subject, message })

  try {
    const accessToken = await auth.getAccessToken()

    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: env.emailUser,
        clientId: env.emailClientId,
        clientSecret: env.emailClientSecret,
        refreshToken: env.emailRefreshToken,
        accessToken,
        expires: 1484314697598,
      },
    })

    const email = {
      ...options,
      subject,
      html: message,
    }

    transport.sendMail(email, (error, result) => {
      if (error) {
        console.log('email error', { error })
      } else {
        console.log('email sent', result)
      }
      transport.close()
    })
  } catch (error) {
    console.log('sendMail failed', error.message)
  }
}

// chargeSucceededHtml (data)
function chargeSucceededHtml(data) {
  const amount = data.amount / 100
  const html = `
  <h1>Stripe Charge Succeeded</h1>
  <p>${data.billing_details.name}</p>
  <p>${data.billing_details.email}</p>
  <p>${data.billing_details.address.line1}</p>
  <p>${data.billing_details.address.line2}</p>
  <p>${data.billing_details.address.city}</p>
  <p>${data.billing_details.address.postal_code}</p>
  <h2>Receipt</h2>
  <p>Amount <strong>£${amount.toFixed(2)}</strong></p>
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
    const customer = await stripe.customers.retrieve('cus_LvjpJCjOWYLO9X')
    html += `
    <p>${customer.name}</p>
    <p>${customer.email}</p>
    <p>${customer.address.line1}</p>
    <p>${customer.address.line2}</p>
    <p>${customer.address.city}</p>
    <p>${customer.address.postal_code}</p>
    <p>${customer.phone}</p>
    `
  } catch (error) {
    html += `<h3>ERROR</h3>
    <p><strong>${error.message}</strong></p>
    `
  }

  return html
}

// webhook handler

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
      sendMail('charge.succeeded', chargeSucceededHtml(object))
    }

    if (type === 'customer.created') {
      console.log(' >>>>> customer.created <<<<')
    }

    if (type === 'customer.deleted') {
      console.log(' >>>>> customer.deleted <<<<')
    }

    if (type === 'customer.updated') {
      console.log(' >>>>> customer.updated <<<<')
    }

    if (type === 'customer.subscription.created') {
      console.log(' >>>>> customer.subscription.created <<<<')
      console.log({ object })
      sendMail(
        'customer.subscription.created',
        await subscriptionSucceededHtml(object),
      )
    }

    if (type === 'customer.subscription.updated') {
      console.log(' >>>>> customer.subscription.updated <<<<')
    }

    if (type === 'customer.subscription.deleted') {
      console.log(' >>>>> customer.subscription.deleted <<<<')
    }

    if (type === 'customer.subscription.trial_will_end') {
      console.log(' >>>>> customer.subscription.trial_will_end <<<<')
    }

    if (type === 'invoice.created') {
      console.log(' >>>>> invoice.created <<<<')
    }
    if (type === 'invoice.deleted') {
      console.log(' >>>>> invoice.deleted <<<<')
    }

    if (type === 'invoice.finalized') {
      console.log(' >>>>> invoice.finalized <<<<')
    }
    if (type === 'invoice.finalization_failed') {
      console.log(' >>>>> invoice.finalization_failed <<<<')
    }
    if (type === 'invoice.paid') {
      console.log(' >>>>> invoice.paid <<<<')
    }

    if (type === 'invoice.sent') {
      console.log(' >>>>> invoice.sent <<<<')
    }

    if (type === 'invoice.payment_action_required') {
      console.log(' >>>>> invoice.payment_action_required <<<<')
    }
    if (type === 'invoice.payment_failed') {
      console.log(' >>>>> invoice.payment_failed <<<<')
    }

    if (type === 'invoice.payment_succeeded') {
      console.log(' >>>>> invoice.payment_succeeded <<<<')
    }
    if (type === 'invoice.upcoming') {
      console.log(' >>>>> invoice.upcoming <<<<')
    }
    if (type === 'invoice.updated') {
      console.log(' >>>>> invoice.updated <<<<')
    }
    if (type === 'invoice.voided') {
      console.log(' >>>>> invoice.voided <<<<')
    }

    if (type === 'payment_intent.created') {
      console.log(' >>>>> payment_intent.created <<<<')
    }
    if (type === 'payment_intent.cancelled') {
      console.log(' >>>>> payment_intent.cancelled <<<<')
    }
    if (type === 'payment_intent.paymemnt_failed') {
      console.log(' >>>>> payment_intent.paymemnt_failed <<<<')
    }
    if (type === 'payment_intent.succeeded') {
      console.log(' >>>>> payment_intent.succeeded <<<<')
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
