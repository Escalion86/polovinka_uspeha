'use client'

import { atomFamily } from 'jotai/utils'
import { getData } from '@helpers/CRUD'
import locationAtom from './locationAtom'

const historiesOfUserAtom = atomFamily((id) => async (get) => {
  const location = get(locationAtom)
  await getData(`/api/${location}/histories`, {
    schema: 'users',
    'data._id': id,
  })
})

export default historiesOfUserAtom
