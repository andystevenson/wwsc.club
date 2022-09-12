export default async (request, { log }) => {
  await log('hello from the edge!')
  return new Response(`hello from the edge`)
}
