'use client'

import { useEffect, useState } from 'react'

export default function useVkAuthAvailability(location) {
  const [isVkAuthEnabled, setIsVkAuthEnabled] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadVkAuthFlag = async () => {
      try {
        const response = await fetch(`/api/global/auth/vk-status?location=${location}`)
        const json = await response.json()
        if (!isMounted) return
        setIsVkAuthEnabled(Boolean(json?.data?.allowVkAuth))
      } catch (error) {
        if (!isMounted) return
        setIsVkAuthEnabled(false)
      }
    }

    if (location) {
      loadVkAuthFlag()
    } else {
      setIsVkAuthEnabled(false)
    }

    return () => {
      isMounted = false
    }
  }, [location])

  return isVkAuthEnabled
}
