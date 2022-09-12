module.exports = (auth) => {
  if (!auth) return false
  const token = auth.split(' ')[1]
  return token === process.env.WWSC_SECRET
}
