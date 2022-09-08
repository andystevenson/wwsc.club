import date from 'https://deno.land/x/deno_dayjs@v0.2.1/mod.ts'

const path = './public/cache/ashbourne/ashbourne.json'
let members = []

const find = (cardnumber) =>
  members.find((member) => member['Card No'] === cardnumber)
try {
  const file = await Deno.readTextFile(path)
  members = JSON.parse(file)
  console.log(members[0])
} catch (error) {
  console.log(`cannot load ashbourne [${path}] because [${error.message}]`)
}

const formatDate = (string) => {
  const dateString = string.split(/\s+/)[0]
  const [day, month, year] = dateString.split('/')
  const result = date()
    .year(+year)
    .month(+month - 1)
    .date(day)

  return result
}

export default async (request, context) => {
  const url = new URL(request.url)
  let cardnumber = url.searchParams.get('cardnumber')
  if (!cardnumber) {
    console.log('card missing')
    return
  }
  cardnumber = cardnumber.trim()

  const response = await context.next()
  let page = await response.text()
  const member = find(cardnumber.trim())
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

  /*   <validity>
  <fullname>
  <status>
  <email>
  <age> */
  const status = member.Status.toLowerCase()
  const fullname =
    (member['First Name'] ? `${member['First Name']} ` : '') + member.Surname
  const email = member.Email.toLowerCase()
  const dob = formatDate(member.DOB)
  const now = date()
  const duration = now.diff(dob, 'years')
  const years = duration
  page = page.replace(/<\/cardcheck>/, '</section>')
  page = page.replace(/<fullname>/, `<strong>${fullname}</strong>`)
  page = page.replace(/<email>/, `<p>${email}</p>`)
  page = page.replace(
    /<age>/,
    `<p><strong>Age:</strong><strong>${years}</strong></p>`,
  )

  if (status === 'expired') {
    page = page.replace(/<cardcheck>/, '<section class="invalid">')
    page = page.replace(/<validity>/, '<h2>Invalid Card</h2>')
    const expired = formatDate(member['Expire Date'])
    page = page.replace(
      /<status>/,
      `<p>expired ${expired.format('DD/MM/YYYY')}</p>`,
    )
  } else {
    page = page.replace(/<cardcheck>/, '<section class="valid">')
    page = page.replace(/<\/cardcheck>/, '</section>')
    page = page.replace(/<status>/, `<p>${status}</p>`)
    page = page.replace(/<validity>/, '<h2>Valid Card</h2>')
  }
  return new Response(page, response)
}
