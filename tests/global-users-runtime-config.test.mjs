import test from 'node:test'
import assert from 'node:assert/strict'
import {
  getGlobalUsersRuntimeConfig,
  isGlobalUsersReadEnabled,
  isGlobalUsersWriteEnabled,
} from '../server/globalUsersRuntimeConfig.mjs'

test('GlobalUsers сохраняет текущий полный rollout по умолчанию', () => {
  const config = getGlobalUsersRuntimeConfig({})

  assert.equal(config.enabled, true)
  assert.equal(config.readFromGlobal, true)
  assert.equal(config.writeToGlobal, true)
  assert.deepEqual(config.rolloutLocations, ['krsk', 'nrsk', 'ekb'])
})

test('GLOBAL_USERS_ENABLED является единым аварийным выключателем', () => {
  const env = { GLOBAL_USERS_ENABLED: 'false' }

  assert.equal(isGlobalUsersReadEnabled('krsk', env), false)
  assert.equal(isGlobalUsersWriteEnabled('krsk', env), false)
})

test('неизвестные города не включают GlobalUsers', () => {
  assert.equal(isGlobalUsersReadEnabled('unknown', {}), false)
  assert.equal(isGlobalUsersWriteEnabled('unknown', {}), false)
  assert.equal(isGlobalUsersReadEnabled('krsk', {
    GLOBAL_USERS_ROLLOUT_LOCATIONS: 'unknown',
  }), false)
})

test('read и write можно откатывать независимо', () => {
  const env = {
    GLOBAL_PROFILE_READ_FROM_GLOBAL: 'false',
    GLOBAL_PROFILE_WRITE_TO_GLOBAL: 'true',
  }

  assert.equal(isGlobalUsersReadEnabled('krsk', env), false)
  assert.equal(isGlobalUsersWriteEnabled('krsk', env), true)
})

test('rollout ограничивается явным списком поддерживаемых городов', () => {
  const env = {
    GLOBAL_USERS_ROLLOUT_LOCATIONS: 'krsk, ekb, unknown, krsk',
  }

  assert.equal(isGlobalUsersReadEnabled('krsk', env), true)
  assert.equal(isGlobalUsersReadEnabled('ekb', env), true)
  assert.equal(isGlobalUsersReadEnabled('nrsk', env), false)
  assert.deepEqual(getGlobalUsersRuntimeConfig(env).rolloutLocations, [
    'krsk',
    'ekb',
  ])
})
