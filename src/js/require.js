import { createRequire } from 'https://deno.land/std@0.155.0/node/module.ts'

// import.meta.url will be the location of "this" module (like `__filename` in
// Node.js), and then serve as the root for your "package", where the
// `package.json` is expected to be, and where the `node_modules` will be used
// for resolution of packages.
const require = createRequire(import.meta.url)

export default require
