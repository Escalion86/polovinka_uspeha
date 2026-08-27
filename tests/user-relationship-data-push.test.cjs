const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const read = (...parts) =>
  fs.readFileSync(path.join(process.cwd(), ...parts), 'utf8')

test('push отправляется только при самостоятельном изменении данных анкеты', () => {
  const crudSource = read('server', 'CRUD.js')

  assert.match(crudSource, /hasUserRelationshipDataChanges\(oldData, data\)/)
  assert.match(
    crudSource,
    /String\(session\?\.user\?\._id \|\| ''\) === String\(data\?\._id \|\| ''\)/
  )
  assert.match(
    crudSource,
    /userRelationshipDataChangedPushNotification\(\{[\s\S]*?oldUser: oldData,[\s\S]*?newUser: data/
  )
})

test('получатель должен включить отдельную настройку push', () => {
  const notificationSource = read(
    'server',
    'userRelationshipDataChangedPushNotification.js'
  )

  assert.match(
    notificationSource,
    /'notifications\.settings\.userRelationshipDataChanged': true/
  )
  assert.match(notificationSource, /notificationType: 'userRelationshipDataChanged'/)
  assert.match(notificationSource, /oldUser\?\.relationship !== newUser\?\.relationship/)
  assert.match(notificationSource, /oldUser\?\.haveKids !== newUser\?\.haveKids/)
})

test('настройка доступна в интерфейсе администратора', () => {
  const settingsSource = read(
    'layouts',
    'content',
    'LoggedUserNotificationsContent.js'
  )
  const roleSettingsSource = read(
    'layouts',
    'content',
    'SettingsRolesContent.js'
  )

  assert.match(settingsSource, /userRelationshipDataChanged/)
  assert.match(roleSettingsSource, /subItem="userRelationshipDataChanged"/)
})
