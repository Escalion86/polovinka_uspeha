const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { atom, createStore } = require('jotai/vanilla')
const { RESET } = require('jotai/utils')

const readSource = (file) => fs.readFileSync(path.join(__dirname, '..', file), 'utf8')
const loadModule = (file, dependencies) => {
  const source = readSource(file)
    .replace(/^import .*\r?$/gm, '')
    .replace(/export default (\w+)/, 'module.exports = $1')
  const context = { module: { exports: {} }, ...dependencies }
  vm.runInNewContext(source, context, { filename: file })
  return context.module.exports
}

// Исполняем реальный блок гидрации и атомы; сеть и несвязанные setters подставлены.
const stateLoader = readSource('components/StateLoader.js')
const hydrationBody = stateLoader.match(
  /useEffect\(\(\) => \{\s*(setNavigationRuntime\(router\)[\s\S]*?)\/\/jotai/
)?.[1]
assert.ok(hydrationBody, 'Блок гидрации StateLoader должен быть найден')

const fixture = () => {
  const store = createStore()
  const locationAtom = atom(null)
  const loadedAtom = atom(false)
  const requests = []
  const atomWithRefreshAndDefault = loadModule('state/atomWithRefreshAndDefault.js', {
    atom, RESET,
  })
  const usersAtom = loadModule('state/async/usersAtomAsync.js', {
    atomWithRefreshAndDefault, locationAtom, store,
    isLoadedAtom: () => loadedAtom,
    getData: async (url) => {
      requests.push(url)
      return [{ _id: url.split('/')[2], firstName: 'Тест' }]
    },
  })

  const hydrate = async (props) => {
    const pending = []
    const setters = Object.fromEntries(
      [...hydrationBody.matchAll(/\b(set\w+)\(/g)].map(([, name]) => [name, () => {}])
    )
    vm.runInNewContext(hydrationBody, {
      ...setters, props, RESET, DEFAULT_ROLES: [], router: {}, snackbar: {},
      loggedUserActiveRole: null, loggedUserActiveStatus: null,
      loggedUser: null, loggedUserActive: null,
      setLocationState: (value) => store.set(locationAtom, value),
      setUsersState: (value) => pending.push(store.set(usersAtom, value)),
    })
    await Promise.all(pending)
    return store.get(usersAtom)
  }
  return { hydrate, requests }
}

const cities = ['krsk', 'nrsk', 'ekb']
for (const location of cities) {
  test(`${location}: первое открытие загружает пользователей выбранного города`, async () => {
    const f = fixture()
    const users = await f.hydrate({ location })
    assert.equal(users.length, 1)
    assert.equal(users[0]._id, location)
    assert.deepEqual(f.requests, [`/api/${location}/users/`])
  })

  for (const nextLocation of cities.filter((city) => city !== location)) {
    test(`${location} -> ${nextLocation}: после перехода загружен новый город`, async () => {
      const f = fixture()
      await f.hydrate({ location })
      const users = await f.hydrate({ location: nextLocation })
      assert.equal(users[0]._id, nextLocation)
      assert.deepEqual(f.requests, [
        `/api/${location}/users/`, `/api/${nextLocation}/users/`,
      ])
    })
  }
}

test('Готовый серверный список сохраняется без дополнительного запроса', async () => {
  const f = fixture()
  const suppliedUsers = [{ _id: 'server-user' }]
  assert.equal(await f.hydrate({ location: 'krsk', users: suppliedUsers }), suppliedUsers)
  assert.deepEqual(f.requests, [])
})

test('Без города запрос не выполняется; последующее открытие города загружает список', async () => {
  const f = fixture()
  assert.equal((await f.hydrate({})).length, 0)
  assert.deepEqual(f.requests, [])
  assert.equal((await f.hydrate({ location: 'ekb' }))[0]._id, 'ekb')
})
