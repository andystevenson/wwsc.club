// const options = { headers: { 'content-type': 'text/html' } }
const path = './public/cache/ashbourne/ashbourne.json'
let members = []

const find = (cardnumber) =>
  members.find((member) => member['Card No'] === cardnumbers)
try {
  const file = await Deno.readTextFile(path)
  members = JSON.parse(file)
} catch (error) {
  console.log(`cannot load ashbourne [${path}] because [${error.message}]`)
}

export default async (request, context) => {
  const url = new URL(request.url)
  const cardnumber = url.searchParams.get('cardnumber')
  if (!cardnumber) {
    console.log('card missing')
    return
  }

  const response = await context.next()
  const page = await response.text()
  const location = `<h1>${context.geo.city}, ${context.geo.country.name} card=${cardnumber}</h1>`
  const regex = /<pre><\/pre>/
  const updated = page.replace(regex, location)
  return new Response(updated, response)
}
