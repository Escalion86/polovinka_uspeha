import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'

import { getData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'

const DEFAULT_SUMMARY = {
  referrers: [],
  referralProgram: null,
  totals: { referrerCount: 0, referralsCount: 0, conditionMetCount: 0 },
  events: [],
}

const isObject = (value) => value && typeof value === 'object'

const mergeSummary = (value) => {
  if (!isObject(value)) {
    return DEFAULT_SUMMARY
  }

  const referrers = Array.isArray(value?.referrers) ? value.referrers : []
  const events = Array.isArray(value?.events) ? value.events : []
  const totals = isObject(value?.totals)
    ? {
        referrerCount: Number(value.totals.referrerCount) || 0,
        referralsCount: Number(value.totals.referralsCount) || 0,
        conditionMetCount: Number(value.totals.conditionMetCount) || 0,
      }
    : DEFAULT_SUMMARY.totals

  return {
    referrers,
    referralProgram: isObject(value?.referralProgram)
      ? value.referralProgram
      : null,
    totals,
    events,
  }
}

const useReferralsAdminSummary = () => {
  const location = useAtomValue(locationAtom)
  const [summary, setSummary] = useState(DEFAULT_SUMMARY)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    if (!location) {
      setSummary(DEFAULT_SUMMARY)
      setIsLoading(false)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    getData(
      `/api/${location}/referrals/admin-summary`,
      {},
      null,
      null,
      false
    )
      .then((result) => {
        if (ignore) return
        setSummary(mergeSummary(result))
      })
      .catch((err) => {
        if (ignore) return
        setError(err instanceof Error ? err : new Error(String(err)))
        setSummary(DEFAULT_SUMMARY)
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [location])

  return {
    ...summary,
    isLoading,
    error,
  }
}

export default useReferralsAdminSummary
