#!/usr/bin/env node

const goodtill = async (updates, newMembers) => {
  const nUpdates = Object.keys(updates).length
  const nNewMembers = Object.keys(newMembers).length
  const totalUpdates = nUpdates + nNewMembers
  if (totalUpdates === 0) return console.log(`no sumup updates/new members`)

  if (nUpdates === 0) console.log(`no sumup updates`)
  if (nNewMembers === 0) console.log(`no sumup new members`)

  const authentication = (
    await import('@andystevenson/goodtill/authentication')
  ).default
  const { login, logout } = authentication
  const customer = (await import('@andystevenson/goodtill/customer')).default
  const { create, update } = customer

  if (!login || !logout || !create || !update)
    throw Error('could not import @andystevenson/goodtill/customer')
  await login()

  for (const member in updates) {
    const updated = await update(updates[member])
    console.log(`updated`, updated.name)
  }

  for (const member in newMembers) {
    const created = await create(newMembers[member])
    console.log(`created`, created.name)
  }
  await logout()
}

const argv = process.argv
const route = '.netlify/builders/sumup-customers-update'
let server = 'http://localhost:8888'
if (argv[2]) server = argv[2]
const endpoint = `${server}/${route}`
console.log({ argv, endpoint })

const token = require('../src/js/authorization-token')
console.log({ token })
const doUpdates = async () => {
  const fetch = (await import('node-fetch')).default

  if (!fetch) throw Error('cannot load fetch')

  const data = await fetch(endpoint, { headers: { authorization: token } })
  console.log(`status `, data.status)
  if (data.ok) {
    const json = await data.json()
    const { updates, newMembers } = json
    const nUpdates = Object.keys(updates).length
    const nNewMembers = Object.keys(newMembers).length
    console.log({ nUpdates, nNewMembers })
    await goodtill(updates, newMembers)
    return
  } else {
    console.error(
      `failed to process sumup updates because [${data.statusText}]`,
    )
  }
}

doUpdates()
