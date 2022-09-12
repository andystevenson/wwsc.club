import token from 'https://raw.githubusercontent.com/andystevenson/wwsc.club/master/src/deno/authorization-token.js'
export default async (request, { log }) => {
  await log('hello from the edge!')
  return new Response(`hello from the edge ${token}`)
}
