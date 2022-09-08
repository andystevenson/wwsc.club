const options = { headers: { 'content-type': 'text/html' } }
export default async (request, context) => {
  console.log('running on the edge....')
  return new Response('hello world from the edge!', options)
}
