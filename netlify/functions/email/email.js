const x = require('stripe')
const env = require('../../../src/js/stripeEnv.js')

const nodemailer = require('nodemailer')
exports.handler = async function (event) {
  console.log('functions/email', process.env.URL)

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
      accessToken: null,
    },
  })

  let message = JSON.parse(event.body)
  const subject = 'subject' in message ? message.subject : 'Hello'
  const text = 'text' in message ? message.text : null
  const html = 'html' in message ? message.html : null

  let email = {
    from: env.emailUser,
    to: env.emailRecipient,
    subject,
  }

  if (text) email = { ...email, text }
  if (html) email = { ...email, html }

  try {
    const result = await transport.sendMail(email)
    console.log('sendMail success')
    return { statusCode: 200, body: 'Ok' }
  } catch (error) {
    console.log('sendMail ', { error })
    return { statusCode: 500, body: error.toString() }
  }
}
