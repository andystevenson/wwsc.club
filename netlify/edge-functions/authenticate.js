import validate from 'https://raw.githubusercontent.com/andystevenson/wwsc.club/master/src/deno/valid-autorization.js'

export default async (request, { log, rewrite }) => {
  const authorization = request.headers.get('authorization')
  if (!validate(authorization)) {
    log(`authenticate failed`)
    return await rewrite('/not-found')
  }
}
