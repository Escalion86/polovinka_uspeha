const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const helperPath = path.join(process.cwd(), 'helpers', 'telegramContactLink.js')

const loadHelper = () => {
  const source = fs
    .readFileSync(helperPath, 'utf8')
    .replace(/export\s+const\s+/g, 'const ')
    .replace(
      /export\s+default\s+getTelegramContactLink\s*;?/,
      'module.exports = { getTelegramContactLink, buildTelegramContactLink }'
    )

  const context = {
    module: { exports: {} },
  }

  vm.runInNewContext(source, context, { filename: helperPath })

  return context.module.exports
}

const plainObject = (value) => JSON.parse(JSON.stringify(value))

test('telegram contact link uses domain for usernames with letters', () => {
  const { getTelegramContactLink } = loadHelper()

  assert.deepEqual(
    plainObject(
      getTelegramContactLink({
        telegram: '@friend_name123',
        phone: '79990000000',
      })
    ),
    {
      href: 'tg://resolve?domain=@friend_name123',
      title: '@friend_name123',
      type: 'domain',
    }
  )
})

test('telegram contact link uses phone for numeric telegram values', () => {
  const { getTelegramContactLink } = loadHelper()

  assert.deepEqual(
    plainObject(
      getTelegramContactLink({ telegram: '79991234567', phone: '70000000000' })
    ),
    {
      href: 'tg://resolve?phone=+79991234567',
      title: '+79991234567',
      type: 'phone',
    }
  )
})

test('telegram contact link keeps a single plus for phone values', () => {
  const { getTelegramContactLink } = loadHelper()

  assert.equal(
    getTelegramContactLink({ telegram: '+79991234567' }).href,
    'tg://resolve?phone=+79991234567'
  )
})

test('telegram contact link falls back to phone when telegram is empty', () => {
  const { getTelegramContactLink } = loadHelper()

  assert.deepEqual(
    plainObject(getTelegramContactLink({ telegram: '', phone: '79991234567' })),
    {
      href: 'tg://resolve?phone=+79991234567',
      title: '+79991234567',
      type: 'phone',
    }
  )
})

test('telegram contact link returns null without telegram or phone', () => {
  const { getTelegramContactLink } = loadHelper()

  assert.equal(getTelegramContactLink({ telegram: '', phone: '' }), null)
})
