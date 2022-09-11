const { builder } = require('@netlify/functions')
const hasSameValues = require('@andystevenson/lib/hasSameValues')
const ashbourne2sumup = require('../../../scripts/src/ashbourne2sumup')

const mapToMembership = (members) => {
  return members.reduce((membership, member) => {
    const memberNo =
      'Member No' in member ? member['Member No'] : member.membership_no
    if (memberNo) membership[memberNo] = member
    return membership
  }, {})
}

const prepareNewMembers = (sumup, ashbourne) => {
  const newMembers = {}

  for (const memberNo in ashbourne) {
    const memberExists = memberNo in sumup

    if (memberExists) {
      // console.log(`member ${sumup[memberNo].name} already on sumup`)
      continue
    }

    const member = ashbourne[memberNo]

    // otherwise we're going to create
    const transformed = ashbourne2sumup(member)
    newMembers[memberNo] = transformed
    // console.log(`new sumup member ${transformed.name}`)
  }
  return newMembers
}

const verbose = true
const prepareUpdates = (sumup, ashbourne) => {
  const updates = { ...sumup }
  for (const memberNo in updates) {
    if (memberNo in ashbourne) {
      const original = updates[memberNo]
      const update = ashbourne2sumup(ashbourne[memberNo])
      update.id = updates[memberNo].id
      // do a diff
      const equal = hasSameValues(update, original, verbose)
      if (equal) {
        console.log(`update to ${updates[memberNo].name} not required`)
        delete updates[memberNo]
      } else {
        // update required
        console.log(`updating ${updates[memberNo].name}`)
        updates[memberNo] = update
      }
    } else {
      // there is no
      console.log(`member ${memberNo} does not exist in ashbourne`)
      delete updates[memberNo]
    }
  }
  return updates
}

const ashbourne = async (fetch, origin) => {
  const ashbourneJson = '.netlify/builders/ashbourne-json'
  const endpoint = `${origin}/${ashbourneJson}`
  const data = await fetch(endpoint)
  return data.json()
}

const sumup = async (fetch, origin) => {
  const sumupJson = '.netlify/builders/sumup-customers'
  const endpoint = `${origin}/${sumupJson}`
  const data = await fetch(endpoint)
  return await data.json()
}

const handler = async (event) => {
  try {
    // fetch ESM modules
    const fetch = (await import('node-fetch')).default

    const url = new URL(event.rawUrl)
    const { origin } = url

    const ashbourneCustomers = await ashbourne(fetch, origin)
    const sumupCustomers = await sumup(fetch, origin)

    const ashbourneMembers = mapToMembership(ashbourneCustomers)
    const sumupMembers = mapToMembership(sumupCustomers)
    const updates = prepareUpdates(sumupMembers, ashbourneMembers)
    const newMembers = prepareNewMembers(sumupMembers, ashbourneMembers)

    let json = JSON.stringify({ updates, newMembers })

    return {
      statusCode: 200,
      body: json,
      headers: {
        'Content-Type': 'application/json',
      },
      ttl: 60,
    }
  } catch (error) {
    return { statusCode: 500, body: error.message }
  }
}

module.exports.handler = builder(handler)
