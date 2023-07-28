import { inspect } from 'node:util'
import graphql from './graphql.mjs'
import { log } from 'node:console'

export const createAttendee = async (booking) => {
  const {
    'roa-programme': programme,
    name,
    email,
    mobile,
    status,
    'booking-reference': reference,
  } = booking
  const member = status !== 'non-member'
  const data = JSON.stringify(booking).replace(/"/g, `\\"`)
  // log({ data })

  // log('createAttendee', {
  //   programme,
  //   name,
  //   email,
  //   mobile,
  //   status,
  //   reference,
  //   member,
  //   data,
  // })
  const query = `mutation CreateAttendee {
                  attendeeCreate(
                    input: {
                      programme: {link: "${programme}"}, 
                      name: "${name}", 
                      email: "${email}", 
                      mobile: "${mobile}", 
                      booking: "${reference}", 
                      member: ${member}, 
                      data: "${data}"
                    }
                  ) {
                    attendee {
                      id
                      name
                      email
                      mobile
                      booking
                      member
                      data
                    }
                  }
                }`
  let attendee = await graphql(query)
  attendee = attendee?.data?.attendeeCreate?.attendee

  // log(
  //   'attendee returned',
  //   inspect(attendee, {
  //     colors: true,
  //     depth: null,
  //   }),
  // )
  return attendee
}
