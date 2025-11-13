'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useMemo } from 'react'

import { getData } from '@helpers/CRUD'
import mergeEventsById from '@helpers/mergeEventsById'
import eventsAtom from '@state/atoms/eventsAtom'
import eventsLoadStatusAtom from '@state/atoms/eventsLoadStatusAtom'
import locationAtom from '@state/atoms/locationAtom'
import serverSettingsAtom from '@state/atoms/serverSettingsAtom'

const MODE_PRECEDENCE = {
  all: ['upcoming', 'past'],
}

const normalizeModes = (modes) => {
  if (!modes) return []
  if (typeof modes === 'string') return [modes]
  if (Array.isArray(modes)) return modes.filter(Boolean)
  return []
}

const resolveModeKey = (mode) => {
  if (mode === 'past' || mode === 'upcoming' || mode === 'all') return mode
  return 'all'
}

const useEnsureEventsLoaded = (requestedModes, options = {}) => {
  const location = useAtomValue(locationAtom)
  const serverSettings = useAtomValue(serverSettingsAtom)
  const serverNow = serverSettings?.dateTime

  const [statusMap, setStatusMap] = useAtom(eventsLoadStatusAtom)
  const setEvents = useSetAtom(eventsAtom)

  const modes = useMemo(() => {
    const normalized = normalizeModes(requestedModes)
      .map(resolveModeKey)
      .filter(Boolean)

    if (normalized.includes('all')) {
      return ['all']
    }

    return Array.from(new Set(normalized))
  }, [requestedModes])

  useEffect(() => {
    if (!location || modes.length === 0) return

    modes.forEach((mode) => {
      if (mode === 'upcoming' || mode === 'past') {
        if (statusMap.all === 'loaded' || statusMap.all === 'loading') {
          if (statusMap[mode] !== 'loaded') {
            setStatusMap((prev) => ({ ...prev, [mode]: prev.all }))
          }
          return
        }
      }

      if (statusMap[mode] === 'loaded' || statusMap[mode] === 'loading') {
        return
      }

      setStatusMap((prev) => ({ ...prev, [mode]: 'loading' }))

      const params = {
        location,
        mode,
      }

      if (typeof options.limit === 'number') {
        params.limit = options.limit
      }

      if (serverNow) {
        params.serverNow = serverNow
      }

      getData(`/api/${location}/events/by-mode`, params)
        .then((events) => {
          if (!Array.isArray(events)) {
            throw new Error('Invalid response')
          }

          setEvents((prev) => mergeEventsById(prev, events))
          setStatusMap((prev) => {
            const next = { ...prev, [mode]: 'loaded' }
            if (mode === 'all') {
              MODE_PRECEDENCE.all.forEach((childMode) => {
                next[childMode] = 'loaded'
              })
            }
            return next
          })
        })
        .catch(() => {
          setStatusMap((prev) => ({ ...prev, [mode]: 'error' }))
        })
    })
  }, [location, modes, options.limit, serverNow, setEvents, setStatusMap, statusMap])

  return useMemo(() => {
    if (modes.length === 0) return {}
    return modes.reduce((acc, mode) => {
      acc[mode] = statusMap[mode]
      return acc
    }, {})
  }, [modes, statusMap])
}

export default useEnsureEventsLoaded
