'use client'

import { LOCATIONS } from '@helpers/constants'
import { useEffect, useState } from 'react'

const getFallbackCityTitle = (location) =>
  LOCATIONS?.[location]?.towns?.[0] || location

export default function useCityAccess({
  location,
  allowField,
  alternativesField,
}) {
  const [accessLoading, setAccessLoading] = useState(true)
  const [isAllowed, setIsAllowed] = useState(true)
  const [currentCityTitle, setCurrentCityTitle] = useState('')
  const [currentCityStatus, setCurrentCityStatus] = useState('active')
  const [alternativeCities, setAlternativeCities] = useState([])

  useEffect(() => {
    let isMounted = true

    const loadCityAccess = async () => {
      if (!location) {
        if (!isMounted) return
        setAccessLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/global/cities/access?location=${location}`)
        const json = await response.json()
        if (!isMounted) return

        const cityData = json?.data?.city || {}
        setIsAllowed(Boolean(cityData?.[allowField]))
        setCurrentCityTitle(cityData?.title || getFallbackCityTitle(location))
        setCurrentCityStatus(
          typeof cityData?.status === 'string' ? cityData.status : 'active'
        )
        setAlternativeCities(
          Array.isArray(json?.data?.[alternativesField])
            ? json.data[alternativesField]
            : []
        )
      } catch (error) {
        if (!isMounted) return
        setIsAllowed(true)
        setCurrentCityTitle(getFallbackCityTitle(location))
        setCurrentCityStatus('active')
        setAlternativeCities([])
      } finally {
        if (isMounted) setAccessLoading(false)
      }
    }

    loadCityAccess()

    return () => {
      isMounted = false
    }
  }, [location, allowField, alternativesField])

  return {
    accessLoading,
    isAllowed,
    currentCityTitle,
    currentCityStatus,
    alternativeCities,
  }
}
