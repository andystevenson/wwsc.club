import { inspect } from 'node:util'
import graphql from './graphql.mjs'
import { log } from 'node:console'

export const createSesionAttendee = async (attendee, sessionIds) => {
  const inputs = sessionIds.map(
    (session) =>
      `{input: {session: {link: "${session}"}, attendee: {link: "${attendee}"}}}`,
  )

  const query = `mutation CreateSessionAttendees {
                  sessionAttendeeCreateMany(
                    input: [${inputs}]
                  ) {
                    sessionAttendeeCollection {
                      id
                    }
                  }
                }`

  const list = await graphql(query)
  console.log(
    'createSessionAttendee',
    inspect(list, { colors: true, depth: null }),
  )
  return list
}
