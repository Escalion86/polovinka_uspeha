import { APIRoute } from 'next-deploy-notifications/api'
import * as fs from 'fs'

let gitVersion = () => {
  let rev = fs.readFileSync('.git/HEAD').toString().trim()
  if (rev.indexOf(':') === -1) return rev
  return fs
    .readFileSync('.git/' + rev.substring(5))
    .toString()
    .trim()
}

console.log('gitVersion :>> ', gitVersion())

export default APIRoute.configure({
  // Return your app's version here.
  version: gitVersion,
})
