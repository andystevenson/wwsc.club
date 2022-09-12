module.exports = process.env.WWSC_SECRET
  ? `Bearer ${process.env.WWSC_SECRET}`
  : null
