'use client'

import { atom } from 'jotai'

import asyncEventsUsersAllAtom from '@state/async/asyncEventsUsersAllAtom'
import usersAtomAsync from '@state/async/usersAtomAsync'
import eventsAtom from '@state/atoms/eventsAtom'

const eventsUsersFullAllSelector = atom(async (get) => {
  const eventsUsers = await get(asyncEventsUsersAllAtom)
  const users = await get(usersAtomAsync)
  const events = get(eventsAtom)

  if (!eventsUsers) return []

  const usersById = new Map(users?.map((user) => [user._id, user]))
  const eventsById = new Map(events?.map((event) => [event._id, event]))

  return eventsUsers.map((item) => ({
    ...item,
    user: usersById.get(item.userId),
    event: eventsById.get(item.eventId),
  }))
})

export default eventsUsersFullAllSelector
