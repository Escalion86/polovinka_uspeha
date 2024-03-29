import { getData } from '@helpers/CRUD'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
// import sleep from '@helpers/sleep'
import { atomFamily, noWait, selectorFamily, useRecoilCallback } from 'recoil'
import { setRecoil } from 'recoil-nexus'
// import asyncEventsUsersAllSelector from './asyncEventsUsersAllSelector'

export const refreshAsyncEventsUsersByEventIdAtom = (eventId) =>
  useRecoilCallback(
    ({ snapshot, set }) =>
      async (params) => {
        if (!eventId) return

        // const current = snapshot.valueMayBe(users(params));

        // if (current) {
        //     return current;
        // }

        const res = await getData(
          '/api/eventsusers',
          { eventId },
          null,
          null,
          false
        )

        const users = await fetchRemoteUsesrs(params)
        for (const user of users) {
          set(users(user.id), user)
        }
        // Normalize it to a list of keys
        return users.map((u) => u.id)
      },
    []
  )

export const asyncEventsUsersByEventIdSelector = selectorFamily({
  key: 'asyncEventsUsersByEventIdSelector',
  get:
    (eventId) =>
    async ({ get }) => {
      // const test = get(noWait(asyncEventsUsersAllSelector))
      // console.log('test', test)
      if (!eventId) return undefined
      const res = await getData(
        '/api/eventsusers',
        { eventId },
        null,
        null,
        false
      )
      // console.debug('!!!', eventId)
      setRecoil(isLoadedAtom('asyncEventsUsersByEventIdAtom' + eventId), true)
      // // Throw error with status code in case Fetch API req failed
      // if (!res.ok) {
      //   throw new Error(res.status)
      // }

      // const json = await res.json()
      // const { data } = json
      return res
    },
  // set:
  //   (eventId) =>
  //   ({ set, get }, newItem) => {
  //     set(asyncEventsUsersByEventIdAtom(eventId), newItem)
  //   },
})

const asyncEventsUsersByEventIdAtom = atomFamily({
  key: 'asyncEventsUsersByEventIdAtom',
  default: asyncEventsUsersByEventIdSelector,
  // effects: [
  //   ({ onSet }) => {
  //     onSet((newID) => {
  //       console.debug('onSet asyncEventsUsersByEventIdAtom', newID)
  //       setRecoil(isLoadedAtom('asyncEventsUsersByEventIdAtom' + newID), true)
  //     })
  //   },
  //   (params) => console.log('params :>> ', params),
  // ],
})

export default asyncEventsUsersByEventIdAtom
