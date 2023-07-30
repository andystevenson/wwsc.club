import process from 'process'
import 'dotenv/config'
import { createAttendee } from '../../../grafbase/scripts/createAttendee.mjs'
import { createSesionAttendee } from '../../../grafbase/scripts/createSessionAttendee.mjs'

let statusCode = 200
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const handler = async (event) => {
  try {
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
    body.sessions = body.sessions ? JSON.parse(body.sessions).sessions : ''
    body['roa-sessions'] = body['roa-sessions']
      ? JSON.parse(body['roa-sessions'])['roa-sessions']
      : ''
    const attendee = await createAttendee(body)
    if (
      body.sessions &&
      body['roa-sessions'] &&
      body.sessions.length > 0 &&
      body['roa-sessions'].length > 0
    ) {
      const sessions = await createSesionAttendee(
        attendee.id,
        body['roa-sessions'],
      )
    }
    return {
      statusCode,
      body: JSON.stringify(attendee),
    }
  } catch (error) {
    statusCode = 500
    console.error('roa-booking error', error)
    return { statusCode, body: error.toString() }
  }
}

export { handler }
