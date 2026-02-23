const ATTRIBUTION_STORAGE_KEY = 'pu_attribution_v1'

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
]

const safeString = (value, max = 200) => {
  if (value === null || value === undefined) return null
  const normalized = String(value).trim()
  if (!normalized) return null
  return normalized.slice(0, max)
}

const parseSearchParams = (search) => {
  const params = new URLSearchParams(search || '')
  return UTM_KEYS.reduce((acc, key) => {
    acc[key] = safeString(params.get(key))
    return acc
  }, {})
}

const readAttributionFromStorage = () => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch (error) {
    return null
  }
}

export const captureAttributionFromBrowser = () => {
  if (typeof window === 'undefined') return null

  const nowIso = new Date().toISOString()
  const current = readAttributionFromStorage() || {}
  const utm = parseSearchParams(window.location.search)
  const firstTouchExists = Boolean(current.firstVisitAt)

  const merged = {
    ...current,
    ...utm,
    firstVisitAt: current.firstVisitAt || nowIso,
    firstLandingPath: current.firstLandingPath || safeString(window.location.pathname, 500),
    firstReferrer:
      current.firstReferrer || safeString(document?.referrer || null, 500),
    lastVisitAt: nowIso,
    lastLandingPath: safeString(window.location.pathname, 500),
    lastReferrer: safeString(document?.referrer || null, 500),
  }

  // Keep first-touch UTM values immutable once they appeared.
  if (firstTouchExists) {
    UTM_KEYS.forEach((key) => {
      if (current[key]) merged[key] = current[key]
    })
  }

  try {
    window.localStorage.setItem(
      ATTRIBUTION_STORAGE_KEY,
      JSON.stringify(merged)
    )
  } catch (error) {
    return null
  }

  return merged
}

export const getAttributionPayload = () => {
  const data = readAttributionFromStorage()
  if (!data) return null
  const result = {
    utm_source: safeString(data.utm_source),
    utm_medium: safeString(data.utm_medium),
    utm_campaign: safeString(data.utm_campaign),
    utm_content: safeString(data.utm_content),
    utm_term: safeString(data.utm_term),
    firstVisitAt: safeString(data.firstVisitAt, 50),
    firstLandingPath: safeString(data.firstLandingPath, 500),
    firstReferrer: safeString(data.firstReferrer, 500),
    lastVisitAt: safeString(data.lastVisitAt, 50),
    lastLandingPath: safeString(data.lastLandingPath, 500),
    lastReferrer: safeString(data.lastReferrer, 500),
  }
  return Object.values(result).some(Boolean) ? result : null
}
