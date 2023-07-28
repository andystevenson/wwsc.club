import { inspect } from 'node:util'
import graphql from './graphql.mjs'
import { log } from 'node:console'

export const createAttendeePayment = async (booking) => {
  const { attendee, reference, time, price, quantity, unitPrice } = booking

  const query = `mutation CreateAttendeePayment {
                  attendeePaymentCreate(input: {
                    attendee: {link: "${attendee}"}, 
                    payment:{create: {
                      booking: "${reference}", 
                      time: "${time}", 
                      price: ${+price}, 
                      quantity: ${+quantity}, 
                      unitPrice: ${+unitPrice}, }}}) {
                    attendeePayment {
                      id
                    }
                  }
                }`

  const payment = await graphql(query)
  // log(inspect(payment, { colors: true, depth: null }))
  return payment
}
