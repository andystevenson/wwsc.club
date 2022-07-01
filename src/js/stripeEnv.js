let env = null

if (!env && process.env.STRIPE_TEST_SECRET_KEY) {
  // we're in a test environment
  const secret = process.env.STRIPE_TEST_SECRET_KEY
  const publishable = process.env.STRIPE_TEST_PUBLISHABLE_KEY
  const webhook = process.env.STRIPE_TEST_WEBHOOK_KEY

  const emailUser = process.env.STRIPE_TEST_EMAIL_USER
  const emailRecipient = process.env.STRIPE_TEST_EMAIL_RECIPIENT
  const emailClientId = process.env.STRIPE_TEST_EMAIL_CLIENT_ID
  const emailClientSecret = process.env.STRIPE_TEST_EMAIL_CLIENT_SECRET
  const emailRefreshToken = process.env.STRIPE_TEST_EMAIL_REFRESH_TOKEN

  const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY)
  env = {
    stripe,
    secret,
    publishable,
    webhook,
    emailUser,
    emailRecipient,
    emailClientId,
    emailClientSecret,
    emailRefreshToken,
  }
}

if (!env && process.env.STRIPE_SECRET_KEY) {
  // we're in a production environment
  console.log('stripe production environment')
  const secret = process.env.STRIPE_SECRET_KEY
  const publishable = process.env.STRIPE_PUBLISHABLE_KEY
  const webhook = process.env.STRIPE_WEBHOOK_KEY

  const emailUser = process.env.STRIPE_EMAIL_USER
  const emailRecipient = process.env.STRIPE_EMAIL_RECIPIENT
  const emailClientId = process.env.STRIPE_EMAIL_CLIENT_ID
  const emailClientSecret = process.env.STRIPE_EMAIL_CLIENT_SECRET
  const emailRefreshToken = process.env.STRIPE_EMAIL_REFRESH_TOKEN

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  env = {
    stripe,
    secret,
    publishable,
    webhook,
    emailUser,
    emailRecipient,
    emailClientId,
    emailClientSecret,
    emailRefreshToken,
  }
  return
}

module.exports = env
