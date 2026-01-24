'use client'

import { atomFamily } from 'jotai-family'

import { atom } from 'jotai'
import eventsAtom from '@state/atoms/eventsAtom'

const eventCutedSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return
    const events = get(eventsAtom)
    const event = events.find((item) => item._id === id)
    return event
  })
)

export default eventCutedSelector

