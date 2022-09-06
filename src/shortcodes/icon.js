const { htmlAttributes } = require('@andystevenson/lib/html')

module.exports = function icon(...args) {
  if (args.length < 1)
    throw SyntaxError('icon expects at least 1 arguments[icon-object]')
  const object = args[0]
  // object needs to be typeof === 'object'
  let type = typeof object
  if (type !== 'object') {
    throw TypeError(
      `icon expects an object as its 1st argument, got [typeof=${type},${object}] instead`,
    )
  }

  const { url: src, width, height, description } = object

  const imgAttributes = htmlAttributes({
    'aria-hidden': true,
    src,
    width,
    height,
    title: description,
  })

  let next = 1
  const extras = htmlAttributes(args.slice(next))

  const template = `<img ${imgAttributes} ${extras}>`
  return template
}
