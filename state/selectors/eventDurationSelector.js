'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import getEventDuration from '@helpers/getEventDuration'
import eventSelector from './eventSelector'

const eventDurationSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return null
    const event = await get(eventSelector(id))
    return getEventDuration(event)
  })
)

export default eventDurationSelector
