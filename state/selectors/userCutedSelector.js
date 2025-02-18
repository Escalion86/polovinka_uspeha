'use client'

import { atomFamily } from 'jotai/utils'

import { atom } from 'jotai'
import usersAtomAsync from '@state/async/usersAtomAsync'

const userCutedSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return
    const users = await get(usersAtomAsync)
    const user = users.find((item) => item._id === id)
    return user
  })
)

export default userCutedSelector
