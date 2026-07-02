import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'

import {
  clearPendingEventMutationsForLocation,
  getPendingEventMutations,
  removePendingEventMutation,
  upsertPendingEventMutation,
} from '../utils/pendingEventMutations.js'

class LocalStorageMock {
  constructor() {
    this.store = new Map()
  }

  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null
  }

  setItem(key, value) {
    this.store.set(key, String(value))
  }

  removeItem(key) {
    this.store.delete(key)
  }
}

beforeEach(() => {
  global.window = {
    dispatchEvent: () => {},
  }
  global.CustomEvent = class CustomEvent {
    constructor(type, init = {}) {
      this.type = type
      this.detail = init.detail
    }
  }
  global.localStorage = new LocalStorageMock()
})

test('upsertPendingEventMutation replaces update for same location and event', () => {
  const first = upsertPendingEventMutation({
    operation: 'update',
    location: 'krsk',
    eventId: 'event-1',
    payload: { title: 'Первое название' },
  })

  const second = upsertPendingEventMutation({
    operation: 'update',
    location: 'krsk',
    eventId: 'event-1',
    payload: { title: 'Новое название' },
  })

  const items = getPendingEventMutations()

  assert.equal(first.id, second.id)
  assert.equal(items.length, 1)
  assert.equal(items[0].payload.title, 'Новое название')
  assert.equal(items[0].attempts, 0)
})

test('upsertPendingEventMutation keeps separate create operations', () => {
  const first = upsertPendingEventMutation({
    operation: 'create',
    location: 'krsk',
    payload: { title: 'Первое мероприятие' },
  })

  const second = upsertPendingEventMutation({
    operation: 'create',
    location: 'krsk',
    payload: { title: 'Второе мероприятие' },
  })

  const items = getPendingEventMutations()

  assert.notEqual(first.id, second.id)
  assert.equal(items.length, 2)
  assert.deepEqual(
    items.map((item) => item.payload.title),
    ['Первое мероприятие', 'Второе мероприятие']
  )
})

test('removePendingEventMutation deletes only selected item', () => {
  const first = upsertPendingEventMutation({
    operation: 'create',
    location: 'krsk',
    payload: { title: 'Первое мероприятие' },
  })
  upsertPendingEventMutation({
    operation: 'create',
    location: 'krsk',
    payload: { title: 'Второе мероприятие' },
  })

  removePendingEventMutation(first.id)

  const items = getPendingEventMutations()

  assert.equal(items.length, 1)
  assert.equal(items[0].payload.title, 'Второе мероприятие')
})

test('clearPendingEventMutationsForLocation removes only current location', () => {
  upsertPendingEventMutation({
    operation: 'create',
    location: 'krsk',
    payload: { title: 'Красноярск' },
  })
  upsertPendingEventMutation({
    operation: 'create',
    location: 'ekb',
    payload: { title: 'Екатеринбург' },
  })

  clearPendingEventMutationsForLocation('krsk')

  const items = getPendingEventMutations()

  assert.equal(items.length, 1)
  assert.equal(items[0].location, 'ekb')
})
