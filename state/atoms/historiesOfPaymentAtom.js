'use client'

import { atomFamily } from 'jotai-family'
import { getData } from '@helpers/CRUD'
import locationAtom from './locationAtom'

const historiesOfPaymentAtom = atomFamily((id) => async (get) => {
  const location = get(locationAtom)
  return await getData(`/api/${location}/histories`, {
    schema: 'payments',
    'data._id': id,
  })
})

export default historiesOfPaymentAtom

