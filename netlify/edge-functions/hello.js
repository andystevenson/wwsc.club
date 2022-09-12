import token from 'https://raw.githubusercontent.com/andystevenson/wwsc.club/master/src/deno/authorization-token.js'
import validate from 'https://raw.githubusercontent.com/andystevenson/wwsc.club/master/src/deno/valid-autorization.js'
export default async (request, { log }) => {
  await log('hello from the edge!')
  return new Response(`hello from the edge ${token} ${validate(token)}`)
}
