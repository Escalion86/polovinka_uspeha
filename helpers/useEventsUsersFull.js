import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'

import { getData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'

const isValidArray = (value) => Array.isArray(value)

const useEventsUsersFull = () => {
  const location = useAtomValue(locationAtom)
  const [eventsUsers, setEventsUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    if (!location) {
      setEventsUsers([])
      return
    }

    setIsLoading(true)
    setError(null)

    getData(`/api/${location}/eventsusers/full`, {}, null, null, false)
      .then((result) => {
        if (ignore) return
        if (isValidArray(result)) {
          setEventsUsers(result)
        } else {
          setEventsUsers([])
          if (result === null) {
            setError(new Error('Не удалось загрузить данные по посещениям'))
          }
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setEventsUsers([])
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [location])

  return { eventsUsers, isLoading, error }
}

export default useEventsUsersFull
