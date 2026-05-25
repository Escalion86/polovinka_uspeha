const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const constantsPath = path.join(process.cwd(), 'helpers', 'constants.js')
const constantsSource = fs.readFileSync(constantsPath, 'utf8')

const getUserStatisticsRoleAccess = () => {
  const match = constantsSource.match(
    /userStatistics:\s*\{[\s\S]*?roleAccess:\s*\(role,\s*status\)\s*=>\s*([\s\S]*?),\s*\n\s*\},/
  )

  assert.ok(match, 'Не удалось найти roleAccess для userStatistics')

  return new Function(
    'role',
    'status',
    `return (${match[1].trim()})`
  )
}

test('member получает доступ к Моей статистике даже без dev/president роли', () => {
  const roleAccess = getUserStatisticsRoleAccess()

  assert.equal(
    roleAccess({ dev: false, president: false, seeMyStatistics: false }, 'member'),
    true
  )
})

test('обычный client без member и seeMyStatistics не получает доступ', () => {
  const roleAccess = getUserStatisticsRoleAccess()

  assert.equal(
    roleAccess({ dev: false, president: false, seeMyStatistics: false }, 'novice'),
    false
  )
})
