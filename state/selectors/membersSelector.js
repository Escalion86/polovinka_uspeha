'use client'

import { atom } from 'jotai'

import usersAtomAsync from '@state/async/usersAtomAsync'

const membersSelector = atom(async (get) => {
  const users = await get(usersAtomAsync)
  return Array.isArray(users)
    ? users.filter((user) => user?.status === 'member')
    : []
})

export default membersSelector
