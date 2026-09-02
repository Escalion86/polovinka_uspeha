const test = require('node:test')
const assert = require('node:assert/strict')
const { classifyCityProfile } = require('../scripts/lib/global-city-profile-cleanup.cjs')

const globalUser = { _id: 'global-old', phone: 70000000001,
  cityProfiles: { krsk: { userId: 'local' } } }
const classify = (local, canonical) => classifyCityProfile({
  globalUser, location: 'krsk',
  users: new Map(local ? [[local._id, local]] : []),
  globalById: new Map(canonical ? [[canonical._id, canonical]] : []),
})

test('cleanup сохраняет анкету с отсутствующим обратным globalUserId', () => {
  assert.equal(classify({ _id: 'local', phone: 70000000001 }).removable, false)
})
test('cleanup сохраняет конфликт, когда каноническая связь не подтверждена', () => {
  assert.equal(classify({ _id: 'local', phone: 70000000002,
    globalUserId: 'global-new' }).removable, false)
})
test('cleanup удаляет только подтвержденную чужую обратную ссылку', () => {
  const canonical = { _id: 'global-new', phone: 70000000002,
    cityProfiles: { krsk: { userId: 'local' } } }
  assert.equal(classify({ _id: 'local', phone: 70000000002,
    globalUserId: 'global-new' }, canonical).removable, true)
})
test('cleanup не удаляет действующую связь', () => {
  assert.equal(classify({ _id: 'local', phone: 70000000001,
    globalUserId: 'global-old' }), null)
})
test('cleanup не удаляет ссылку, которую можно перевязать на живую анкету', () => {
  assert.equal(classify({ _id: 'other-local', phone: 70000000001 }).removable, false)
})
test('cleanup допускает удаление ссылки на отсутствующую анкету', () => {
  assert.equal(classify(null).reason, 'LOCAL_USER_MISSING')
  assert.equal(classify(null).removable, true)
})
