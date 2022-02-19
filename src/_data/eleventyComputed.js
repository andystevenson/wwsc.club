// should really go in ajs/11ty.js
const { statSync } = require('fs')

module.exports = {
  layout: (data) => 'base.njk',
  title: (data) => {
    return data.page.fileSlug || 'WWSC'
  },
  permalink: (data) => `/${data.page.fileSlug}/index.html`,
  script: (data) => {
    let src = `${data.page.fileSlug || 'WWSC'}.js`
    try {
      // throws if file does not exist
      const stat = statSync(`./src/js/${src}`)
      console.log(`${src} file exists`)
    } catch (error) {
      console.log(`${src} file DOES NOT exists!!! [${error.message}]`)
      src = undefined
    }
    return src
  },
}
