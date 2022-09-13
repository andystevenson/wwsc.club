import ashbourne from '../../.cache/ashbourne/card-check.json' assert { type: 'json' }

export default async (request, context) => {
  const members = ashbourne

  const url = new URL(request.url)
  let cardnumber = url.searchParams.get('cardnumber')
  if (!cardnumber) {
    context.log('card missing')
    return
  }
  cardnumber = +cardnumber.trim()

  const response = await context.next()
  let page = await response.text()
  const member = cardnumber in members ? members[cardnumber] : null

  if (!member) {
    page = page.replace(/<cardcheck>/, '<section class="invalid">')
    page = page.replace(/<\/cardcheck>/, '</section>')
    page = page.replace(/<validity>/, '<h2>Invalid Card</h2>')
    page = page.replace(/<fullname>/, '')
    page = page.replace(/<status>/, '')
    page = page.replace(/<email>/, '')
    page = page.replace(/<age>/, '')
    return new Response(page, response)
  }

  const [valid, fullname, status, email, age] = member

  page = page.replace(/<\/cardcheck>/, '</section>')
  page = page.replace(/<fullname>/, `<strong>${fullname}</strong>`)
  page = page.replace(/<email>/, `<p>${email}</p>`)
  page = page.replace(
    /<age>/,
    `<p><strong>Age:</strong><strong>${age}</strong></p>`,
  )
  page = page.replace(/<status>/, `<p>${status}</p>`)

  if (valid) {
    page = page.replace(/<cardcheck>/, '<section class="valid">')
    page = page.replace(/<validity>/, '<h2>Valid Card</h2>')
  } else {
    page = page.replace(/<cardcheck>/, '<section class="invalid">')
    page = page.replace(/<validity>/, '<h2>Invalid Card</h2>')
  }
  return new Response(page, response)
}
