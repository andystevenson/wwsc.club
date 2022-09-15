import ashbourne from '../../.cache/ashbourne/card-check.json' assert { type: 'json' }

export default (request, { log, next }) => {
  const url = new URL(request.url)
  let search = url.searchParams.get('search')
  if (!search) return

  search = search.trim()
  search = search.replaceAll(/\s+/g, ' ')

  const searchRegex = new RegExp(`^.*${search}.*$`, 'ig')

  const matches = Object.entries(ashbourne)
    .filter(([, member]) => {
      const [, fullname] = member
      return searchRegex.test(fullname)
    })
    .map(([card, member]) => {
      const [value, fullname, status, email, age] = member
      const template = `<li ${value}><p>${card}</p><p>${fullname}</p><a href="mailto:${email}"><p>${email}</p></a><p>${status}</p><p>${age}</p></li>`
      return template
    })
    .join('\n')

  return new Response(matches)
}
