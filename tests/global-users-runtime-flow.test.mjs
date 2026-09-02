import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import {
  isGlobalUsersReadEnabled,
  isGlobalUsersWriteEnabled,
} from '../server/globalUsersRuntimeConfig.mjs'

// Исполняем реальный helper, подставляя только импортируемые границы БД/ENV.
const loadHelper = (file, name, dependencies) => {
  const source = fs.readFileSync(new URL(`../server/${file}`, import.meta.url), 'utf8')
    .replace(/^import[\s\S]*?from ['"][^'"]+['"]\r?$/gm, '')
    .replace(`export default ${name}`, `module.exports = ${name}`)
    .replace(`export const ${name}`, `const ${name}`)
  const context = { module: { exports: {} }, console, ...dependencies }
  vm.runInNewContext(`${source}\nmodule.exports = ${name}`, context, { filename: file })
  return context.module.exports
}

const query = (value) => ({
  sort() { return this },
  select() { return this },
  lean: async () => value,
})
const gid = '111111111111111111111111'
const uid = '222222222222222222222222'
const foreignId = '333333333333333333333333'
const phone = 70000000001

const fixture = ({ location, env = {}, users = [], globalUser = null }) => {
  const writes = []
  let globalReads = 0
  const localModel = {
    findById: (id) => query(users.find((user) => user._id === id)),
    findOne: (filter) => query(users.find((user) => Object.entries(filter)
      .every(([key, value]) => user[key] === value))),
    findByIdAndUpdate: (id, update) => {
      writes.push({ kind: 'local-update', id })
      return query({ ...users.find((user) => user._id === id), ...update.$set })
    },
    create: async (data) => {
      writes.push({ kind: 'local-create' })
      return { _id: uid, ...data }
    },
  }
  const db = {
    model: (name) => name === 'Histories'
      ? { create: async () => writes.push({ kind: 'history' }) }
      : localModel,
  }
  const helper = loadHelper('ensureLocalUserFromGlobalByPhone.js',
    'ensureLocalUserFromGlobalByPhone', {
      checkLocationValid: (city) => ['krsk', 'nrsk', 'ekb'].includes(city),
      normalizePhoneValue: (value) => String(value ?? '').replace(/\D/g, ''),
      normalizeRelationshipStatus: (value) => value || null,
      isRelationshipStatusValid: (value) => Boolean(value),
      isGlobalUsersReadEnabled: (city) => isGlobalUsersReadEnabled(city, env),
      isGlobalUsersWriteEnabled: (city) => isGlobalUsersWriteEnabled(city, env),
      dbConnectGlobal: async () => {
        globalReads++
        return { model: () => ({
          findOne: () => query(globalUser),
          findOneAndUpdate: async () => { writes.push({ kind: 'global-update' }) },
        }) }
      },
    })
  return {
    run: () => helper({ db, location, phone }),
    writes,
    get globalReads() { return globalReads },
  }
}

for (const location of ['krsk', 'nrsk', 'ekb']) {
  test(`${location}: аварийный откат не читает GlobalUsers и не меняет данные`, async () => {
    const f = fixture({ location, env: { GLOBAL_USERS_ENABLED: 'false' },
      users: [{ _id: uid, phone, role: 'client' }] })
    const result = await f.run()
    assert.equal(result.data.localUser._id, uid)
    assert.equal(f.globalReads, 0)
    assert.equal(f.writes.length, 0)
  })

  test(`${location}: WRITE=false запрещает link/update/create из read-path`, async () => {
    for (const users of [[], [{ _id: uid, phone, globalUserId: gid }]]) {
      const f = fixture({ location, env: { GLOBAL_PROFILE_WRITE_TO_GLOBAL: 'false' },
        users, globalUser: { _id: gid, phone, cityProfiles: {} } })
      const result = await f.run()
      assert.equal(result.success, true)
      assert.equal(result.data.localUserCreated, false)
      assert.equal(f.writes.length, 0)
    }
  })

  test(`${location}: чужая cityProfiles-ссылка игнорируется, локальный ban сохраняется`, async () => {
    const f = fixture({ location, users: [
      { _id: foreignId, phone: 70000000002, globalUserId: foreignId },
      { _id: uid, phone, globalUserId: gid, role: 'client', status: 'ban' },
    ], globalUser: { _id: gid, phone, cityProfiles: {
      [location]: { userId: foreignId, role: 'dev', status: 'active' },
    } } })
    const result = await f.run()
    assert.equal(result.data.localUser._id, uid)
    assert.equal(result.data.localUser.role, 'client')
    assert.equal(result.data.localUser.status, 'ban')
    assert.equal(f.writes.some((write) => write.id === foreignId), false)
  })

  test(`${location}: конфликт прямой ссылки блокирует мутации`, async () => {
    const f = fixture({ location,
      users: [{ _id: uid, phone, globalUserId: foreignId }],
      globalUser: { _id: gid, phone, cityProfiles: {} },
    })
    const result = await f.run()
    assert.equal(result.success, false)
    assert.equal(result.data.error.type, 'GLOBAL_USER_LINK_CONFLICT')
    assert.equal(f.writes.length, 0)
  })

  test(`${location}: реальный session callback работает без global profile/security`, async () => {
    const user = { _id: uid, phone, role: 'client', status: 'novice',
      security: { private: true }, notifications: { settings: { newEvents: false } },
      save() {},
    }
    const options = loadHelper('authOptions.js', 'authOptions', {
      process: { env: {} },
      CredentialsProvider: (options) => options,
      mongoose: { Types: { ObjectId: { isValid: () => true } } },
      dbConnect: async () => ({ model: () => ({ findById: async () => user }) }),
      dbConnectGlobal: () => { throw new Error('Global DB недоступна при rollback') },
      ensureConsentToMailingField: async () => {},
      isAuthDevOnlyModeEnabled: () => false,
      isGlobalUsersReadEnabled: () => false,
    })
    const session = await options.callbacks.session({
      session: { user: {} }, token: { userId: uid, location, phone },
    })
    assert.equal(session.location, location)
    assert.equal(session.user.role, 'client')
    assert.equal(session.user.security.private, true)
    assert.equal(session.user.notifications.settings.newEvents, false)
  })
}

test('syncGlobalUserLink при WRITE=false не подключается ни к одной БД', async () => {
  const helper = loadHelper('syncGlobalUserLink.js', 'syncGlobalUserLink', {
    checkLocationValid: () => true,
    isGlobalUsersWriteEnabled: () => false,
    dbConnectGlobal: () => { throw new Error('Не должно быть обращений к БД') },
    dbConnect: () => { throw new Error('Не должно быть обращений к БД') },
  })
  const result = await helper({ location: 'krsk', user: { _id: uid } })
  assert.equal(result.data.globalUsersSkipped, true)
})
