export default (auth) => {
  if (!auth) return false
  const token = auth.split(' ')[1]
  return token === Deno.env.get('WWSC_SECRET')
}
