// should really go in ajs/11ty.js
const { statSync } = require('fs')

module.exports = {
  title: (data) => {
    return data.page.fileSlug || 'WWSC'
  },
  script: (data) => {
    let src = `${data.page.fileSlug || 'WWSC'}.js`
    try {
      // throws if file does not exist
      const stat = statSync(`./src/js/${src}`)
      // console.log(`${src} file exists`)
    } catch (error) {
      // console.log(`${src} file DOES NOT exists!!! [${error.message}]`)
      src = undefined
    }
    return src
  },
  site: 'https://westwarwicks.club',
  company: 'West Warwickshire Sports Complex',
  description:
    'West Warwickshire Sports Complex - the heart of sport & hospitality in Solihull.',
  email: 'admin@westwarwicks.co.uk',
  telephone: '+44 121 706 3594',
}
