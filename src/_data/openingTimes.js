console.log(`processing opening times...`)
const { readFileSync } = require('node:fs')
const util = require('util')

const log = (obj) =>
  console.log(util.inspect(obj, { depth: null, colors: true }))

const render = (el) => {
  const open = `<${el.element}${el.id ? ' id="' + el.id + '"' : ''}${
    el.class ? ' class="' + el.class + '"' : ''
  }${el.href ? ' href="' + el.href + '"' : ''}>`
  const close = `</${el.element}>`
  const children = el.children ? el.children.map((child) => render(child)) : ''
  const value = el.value ? el.value : ''
  return [open, children, value, close].filter((empty) => empty)
}

let json = null
try {
  const filename = './public/cache/opening-times/opening-times.json'
  json = JSON.parse(readFileSync(filename))
} catch (error) {
  throw Error(`failed to read opening-times because [${error.message}]`)
}

let s = util.inspect(render(json), { depth: null })
s = s.replace(/\[|\]/g, '')
s = s.replace(/'/g, '')
s = s.replace(/>, /g, '>')
s = s.replace(/, </g, '<')
s = s.replace(/> ,/g, '>')
s = s.replace(/> \n/g, '>\n')
s = s.replace(/,\n/g, '\n')
s = s.replace(/\s+$/g, '')

module.exports = s
