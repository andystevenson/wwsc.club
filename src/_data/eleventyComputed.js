// should really go in ajs/11ty.js
const { statSync } = require('fs')

module.exports = {
  title: (data) => {
    return data.page.fileSlug || 'WWSC'
  },
  script: (data) => {
    let src = `${data.page.fileSlug || 'WWSC'}.js`
    let msrc = `${data.page.fileSlug || 'WWSC'}.mjs`
    const stat = statSync(`./src/js/pages/${src}`, { throwIfNoEntry: false })
    const mstat = statSync(`./src/js/pages/${msrc}`, { throwIfNoEntry: false })
    msrc = mstat ? msrc : null
    src = stat ? src : null
    return msrc || src
  },
  site: 'https://westwarwicks.club',
  company: 'West Warwickshire Sports Complex',
  description:
    'West Warwickshire Sports Complex - the heart of sport & hospitality in Solihull.',
  email: 'admin@westwarwicks.co.uk',
  telephone: '+44 121 706 3594',
}
