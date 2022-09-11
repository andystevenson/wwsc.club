const { builder } = require('@netlify/functions')
// const { customers } = require('@andystevenson/goodtill/customer')
const handler = async () => {
  try {
    // fetch ESM modules

    const authentication = (
      await import('@andystevenson/goodtill/authentication')
    ).default
    const { login, logout } = authentication
    const customer = (await import('@andystevenson/goodtill/customer')).default
    const { customers } = customer

    if (!customers || !login || !logout)
      throw Error('could not import @andystevenson/goodtill/customer')

    await login()
    const all = await customers()
    await logout()

    let json = JSON.stringify(all)

    return {
      statusCode: 200,
      body: json,
      headers: {
        'Content-Type': 'application/json',
      },
      ttl: 60,
    }
  } catch (error) {
    return { statusCode: 500, body: error.message }
  }
}

module.exports.handler = builder(handler)
