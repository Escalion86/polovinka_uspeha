'use client'

import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'

import { getData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'

const isArray = (value) => Array.isArray(value)

const useUsersStatistics = () => {
  const location = useAtomValue(locationAtom)
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    if (!location) {
      setUsers([])
      setIsLoading(false)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    getData(`/api/${location}/users/statistics`, {}, null, null, false)
      .then((result) => {
        if (ignore) return

        if (isArray(result)) {
          setUsers(result)
        } else {
          setUsers([])
          if (result === null) {
            setError(new Error('Не удалось загрузить данные о пользователях'))
          }
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setUsers([])
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [location])

  return { users, isLoading, error }
}

export default useUsersStatistics
