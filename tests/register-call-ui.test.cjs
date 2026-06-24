const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const registerClientPath = path.join(
  process.cwd(),
  'app',
  '_components',
  'location',
  'LocationRegisterClient.jsx'
)

const source = fs.readFileSync(registerClientPath, 'utf8')

test('registration call phone is centered and has a mobile tap hint', () => {
  assert.match(
    source,
    /className="[^"]*\btext-center\b[^"]*"[\s\S]*?href=\{`tel:\+\$\{backCallRes\.auth_phone\}`\}/,
    'phone call block should center the tappable number'
  )
  assert.match(
    source,
    /\(нажмите на номер, чтобы позвонить на него\)/,
    'mobile users should see that the phone number is tappable'
  )
  assert.match(
    source,
    /className="[^"]*\bmd:hidden\b[^"]*"/,
    'tap hint should be hidden on desktop'
  )
})
