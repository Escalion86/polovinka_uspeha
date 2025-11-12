'use client'

import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'

import { getData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'

const isObject = (value) => value && typeof value === 'object'

const useReferralsSummary = (referrerId) => {
  const location = useAtomValue(locationAtom)
  const [referrals, setReferrals] = useState([])
  const [referralProgram, setReferralProgram] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    if (!location || !referrerId) {
      setReferrals([])
      setReferralProgram(null)
      setIsLoading(false)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    getData(
      `/api/${location}/referrals/summary`,
      { referrerId },
      null,
      null,
      false
    )
      .then((result) => {
        if (ignore) return

        if (isObject(result)) {
          const { referrals: rawReferrals, referralProgram: rawProgram } = result
          setReferrals(Array.isArray(rawReferrals) ? rawReferrals : [])
          setReferralProgram(isObject(rawProgram) ? rawProgram : null)
        } else {
          setReferrals([])
          setReferralProgram(null)
        }
      })
      .catch((err) => {
        if (ignore) return
        setError(err instanceof Error ? err : new Error(String(err)))
        setReferrals([])
        setReferralProgram(null)
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [location, referrerId])

  return { referrals, referralProgram, isLoading, error }
}

export default useReferralsSummary
