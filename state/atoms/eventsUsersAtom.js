import { atom, selector } from 'recoil'

const contentType = 'application/json'

const eventsUsersAsyncSelector = selector({
  key: 'eventsUsersAsyncSelector',
  get: async ({ get }) => {
    const res = await fetch('/api/eventsusers', {
      method: 'GET',
      headers: {
        Accept: contentType,
        'Content-Type': contentType,
      },
    })
    // // Throw error with status code in case Fetch API req failed
    // if (!res.ok) {
    //   throw new Error(res.status)
    // }

    const json = await res.json()
    const { data } = json
    return data
  },
})

const eventsUsersAtom = atom({
  key: 'eventsUsers',
  default: eventsUsersAsyncSelector,
})

export default eventsUsersAtom
