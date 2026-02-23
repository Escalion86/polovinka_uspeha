'use client'

import { useAtomValue } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import locationAtom from '@state/atoms/locationAtom'
import { LOCATIONS } from '@helpers/constants'

const accessCache = new Map()
const accessPromises = new Map()

const resolveAccessByLocation = async (location) => {
  if (!location) {
    return {
      allowEventManagement: true,
      cityTitle: '',
    }
  }

  if (accessCache.has(location)) return accessCache.get(location)
  if (accessPromises.has(location)) return accessPromises.get(location)

  const request = fetch(`/api/global/cities/access?location=${location}`)
    .then((res) => res.json())
    .then((json) => {
      const city = json?.data?.city || {}
      const access = {
        allowEventManagement: Boolean(city?.allowEventManagement),
        cityTitle: city?.title || LOCATIONS?.[location]?.towns?.[0] || location,
      }
      accessCache.set(location, access)
      accessPromises.delete(location)
      return access
    })
    .catch(() => {
      const fallbackAccess = {
        allowEventManagement: true,
        cityTitle: LOCATIONS?.[location]?.towns?.[0] || location,
      }
      accessCache.set(location, fallbackAccess)
      accessPromises.delete(location)
      return fallbackAccess
    })

  accessPromises.set(location, request)
  return request
}

const useCityManagementAccess = () => {
  const location = useAtomValue(locationAtom)
  const [loading, setLoading] = useState(true)
  const [allowEventManagement, setAllowEventManagement] = useState(true)
  const [cityTitle, setCityTitle] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadAccess = async () => {
      if (!location) {
        if (!isMounted) return
        setAllowEventManagement(true)
        setCityTitle('')
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const access = await resolveAccessByLocation(location)
        if (!isMounted) return

        setAllowEventManagement(Boolean(access?.allowEventManagement))
        setCityTitle(access?.cityTitle || LOCATIONS?.[location]?.towns?.[0] || location)
      } catch (error) {
        if (!isMounted) return
        setAllowEventManagement(true)
        setCityTitle(LOCATIONS?.[location]?.towns?.[0] || location)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadAccess()

    return () => {
      isMounted = false
    }
  }, [location])

  return useMemo(
    () => ({
      loading,
      allowEventManagement,
      cityTitle,
    }),
    [allowEventManagement, cityTitle, loading]
  )
}

export default useCityManagementAccess
