import require from '../../src/js/require.js'
const validate = require('../../src/js/valid-autorization.js')

export default async (request, { log, rewrite }) => {
  const authorization = request.headers.get('authorization')
  if (!validate(authorization)) {
    log(`authenticate failed`)
    return await rewrite('/not-found')
  }
}
