import { programmeByName } from '../../../grafbase/scripts/programmeByName.mjs'
const handler = async (event) => {
  try {
    const name = event.queryStringParameters.name || null
    if (name) {
      const programme = await programmeByName(name)
      return {
        statusCode: 200,
        body: JSON.stringify(programme),
      }
    }
    throw Error('programme name must be specified')
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

export { handler }
