import date from 'https://deno.land/x/deno_dayjs@v0.2.1/mod.ts'
// import require from '../../src/js/require.js'
// const token = require('../../src/js/authorization-token.js')
// causes the function to crash when deployed... fine locally

const token = 'wibble'
// hack to get round not loading cjs in deno??!!
const memberStatuses = [
  'live',
  'dd hold',
  'dd presale',
  'defaulter',
  'paid in full',
  'freeze',
]

const isMember = (status) =>
  memberStatuses.includes(status.trim().toLowerCase())

const cache = 'api/ashbourne-json'

const find = (members, cardnumber) => {
  if (cardnumber === '') return null
  if (+cardnumber === 0) return null
  return members.find((member) => +member['Card No'] === +cardnumber)
}

const loadCache = async (url, { log }) => {
  const path = `${url.origin}/${cache}`
  try {
    log(`loading cache-ashbourne...`)
    // const options = {headers: { authorization: token }}
    const file = await fetch(path)
    if (file.ok) {
      const members = await file.json()
      console.log(members[0])
      log('loaded cache-ashbourne')
      return members
    } else {
      log(`cache-ashbourne not accessible`, file.statusText)
      throw Error(file.statusText)
    }
  } catch (error) {
    log(`cannot load ashbourne because [${error.message}]`)
    return []
  }
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
  const members = await loadCache(url, context)

  let cardnumber = url.searchParams.get('cardnumber')
  if (!cardnumber) {
    context.log('card missing')
    return
  }
  cardnumber = cardnumber.trim()

  const response = await context.next()
  let page = await response.text()
  const member = find(members, cardnumber.trim())

  // console.log(`found`, member)

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

  // console.log(`isMember(${status}) = ${isMember(status)}`)
  if (isMember(status)) {
    page = page.replace(/<cardcheck>/, '<section class="valid">')
    page = page.replace(/<status>/, `<p>${status}</p>`)
    page = page.replace(/<validity>/, '<h2>Valid Card</h2>')
  } else {
    page = page.replace(/<cardcheck>/, '<section class="invalid">')
    page = page.replace(/<validity>/, '<h2>Invalid Card</h2>')
    const expired = formatDate(member['Expire Date'])
    const displayDate = expired.isValid() ? expired.format('DD/MM/YYYY') : ''
    page = page.replace(/<status>/, `<p>${status} ${displayDate}</p>`)
  }
  return new Response(page, response)
}
