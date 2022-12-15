const { log } = require('@andystevenson/lib/logger')
const { isEmpty } = require('lodash')

module.exports = async (resource = 'hello', params = {}) => {
  let url = `${process.env.WWSC_INFO}/api/${resource}`
  if (!isEmpty(params)) {
    const options = new URLSearchParams(params)
    url = `${url}?${options}`
  }

  try {
    log.info(`${resource}...`)
    // const fetch = (await import('node-fetch')).default
    const response = await fetch(url)
    if (response.ok) {
      const join = await response.json()
      log.info(`${resource} succeeded`)
      return join
    }
    log.error(`${resource} failed [${response.status}, ${response.statusText}]`)
  } catch (error) {
    log.error(`${resource} failed [${error.message}]`)
    throw error
  }
}
