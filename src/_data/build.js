const build = {
  development: process.env.BUILD === 'development' || !process.env.BUILD,
  production: process.env.BUILD === 'production',
}

module.exports = build
