export default Deno.env.get('WWSC_SECRET')
  ? `Bearer ${Deno.env.get('WWSC_SECRET')}`
  : null
