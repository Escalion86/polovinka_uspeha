const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const read = (...parts) =>
  fs.readFileSync(path.join(process.cwd(), ...parts), 'utf8')

test('credentials, VK, Telegram и session используют управляемый global read', () => {
  const auth = read('server', 'authOptions.js')

  assert.match(auth, /isGlobalUsersReadEnabled\(location\)/)
  assert.match(auth, /source: 'login-read'/)
  assert.match(auth, /source: 'vk-global-phone-read'/)
  assert.match(auth, /source: 'telegram-global-id-read'/)
  assert.match(auth, /source: 'session-location-switch'/)
  assert.match(auth, /const globalSecurity = toPlainObject\(globalProfile\?\.security\) \|\| \{\}/)
})

test('register и recovery синхронизируют GlobalUsers через общий write guard', () => {
  const telefonip = read('server', 'api', 'telefonip.js')
  const sync = read('server', 'syncGlobalUserLink.js')

  assert.match(telefonip, /source: isForgotPassword \? 'recovery-read' : 'register-read'/)
  assert.match(telefonip, /'recovery-password-reset'/)
  assert.match(telefonip, /'register-password-set'/)
  assert.match(sync, /isGlobalUsersWriteEnabled\(location\)/)
})

test('городские роли и статусы сохраняются при создании локальной проекции', () => {
  const ensure = read('server', 'ensureLocalUserFromGlobalByPhone.js')

  assert.match(ensure, /locationProfile\?\.role \|\| 'client'/)
  assert.match(ensure, /locationProfile\?\.status \|\| defaultCityStatus/)
  assert.match(ensure, /findOne\(\{ globalUserId \}\)/)
  assert.match(ensure, /localExisting\?\.status \|\| locationStatus/)
})

test('глобальное согласие и локальные настройки уведомлений разделены', () => {
  const auth = read('server', 'authOptions.js')
  const newsletter = read('server', 'sendNewsletterMessages.js')

  assert.match(auth, /Настройки уведомлений хранятся по локациям/)
  assert.match(auth, /globalUser\?\.notifications\?\.consentToMailing/)
  assert.match(newsletter, /globalUsers/)
})
