const formatPoundValue = (value) => {
  const { length } = value
  const result = `£${Number(value).toFixed(2)}`.padStart(7, ' ')
  return result
}

module.exports = formatPoundValue
