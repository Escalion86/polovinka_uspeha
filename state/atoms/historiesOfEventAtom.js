'use client'

import { atomFamily } from 'jotai-family'
import { getData } from '@helpers/CRUD'
import locationAtom from './locationAtom'

const historiesOfEventAtom = atomFamily((id) => async (get) => {
  const location = get(locationAtom)
  return await getData(`/api/${location}/histories`, {
    schema: 'events',
    'data._id': id,
  })
})

export default historiesOfEventAtom

