import { LOCATIONS_KEYS } from './serverConstants'

export const CITIES_CONTENT_KEY = 'cities'
export const CITY_STATUSES = ['active', 'closing', 'archived']

const BASE_CITY_DEFAULT = Object.freeze({
  title: '',
  status: 'active',
  isVisibleInPublicSelector: true,
  timeZone: null,
  contactPhone: null,
  contactTelegram: null,
  allowRegistration: true,
  allowLogin: true,
  allowEventSignup: true,
  allowEventManagement: true,
  allowPublicListing: true,
  allowVkAuth: false,
})

const DEFAULT_CORE_CITIES = Object.freeze([
  {
    slug: 'krsk',
    title: 'Красноярск',
    timeZone: 'Asia/Krasnoyarsk',
    index: 0,
  },
  {
    slug: 'nrsk',
    title: 'Норильск',
    status: 'closing',
    timeZone: 'Asia/Krasnoyarsk',
    allowRegistration: false,
    allowEventSignup: false,
    allowEventManagement: false,
    index: 1,
  },
  {
    slug: 'ekb',
    title: 'Екатеринбург',
    timeZone: 'Asia/Yekaterinburg',
    index: 2,
  },
])

const normalizeBoolean = (value, fallback = true) =>
  typeof value === 'boolean' ? value : fallback

const normalizeString = (value, fallback = null) => {
  if (value === null || value === undefined) return fallback
  const trimmed = String(value).trim()
  return trimmed ? trimmed : fallback
}

export const normalizeCityStatus = (status, fallback = 'active') =>
  CITY_STATUSES.includes(status) ? status : fallback

export const normalizeCity = (city = {}, fallback = {}) => {
  const slug = normalizeString(city?.slug, fallback?.slug || null)
  if (!slug) return null

  return {
    slug,
    title: normalizeString(city?.title, fallback?.title || slug),
    status: normalizeCityStatus(
      city?.status,
      normalizeCityStatus(fallback?.status, BASE_CITY_DEFAULT.status)
    ),
    isVisibleInPublicSelector: normalizeBoolean(
      city?.isVisibleInPublicSelector,
      normalizeBoolean(
        fallback?.isVisibleInPublicSelector,
        BASE_CITY_DEFAULT.isVisibleInPublicSelector
      )
    ),
    timeZone: normalizeString(city?.timeZone, fallback?.timeZone ?? null),
    contactPhone: normalizeString(
      city?.contactPhone,
      fallback?.contactPhone ?? null
    ),
    contactTelegram: normalizeString(
      city?.contactTelegram,
      fallback?.contactTelegram ?? null
    ),
    allowRegistration: normalizeBoolean(
      city?.allowRegistration,
      normalizeBoolean(
        fallback?.allowRegistration,
        BASE_CITY_DEFAULT.allowRegistration
      )
    ),
    allowLogin: normalizeBoolean(
      city?.allowLogin,
      normalizeBoolean(fallback?.allowLogin, BASE_CITY_DEFAULT.allowLogin)
    ),
    allowEventSignup: normalizeBoolean(
      city?.allowEventSignup,
      normalizeBoolean(
        fallback?.allowEventSignup,
        BASE_CITY_DEFAULT.allowEventSignup
      )
    ),
    allowEventManagement: normalizeBoolean(
      city?.allowEventManagement,
      normalizeBoolean(
        fallback?.allowEventManagement,
        BASE_CITY_DEFAULT.allowEventManagement
      )
    ),
    allowPublicListing: normalizeBoolean(
      city?.allowPublicListing,
      normalizeBoolean(
        fallback?.allowPublicListing,
        BASE_CITY_DEFAULT.allowPublicListing
      )
    ),
    allowVkAuth: normalizeBoolean(
      city?.allowVkAuth,
      normalizeBoolean(fallback?.allowVkAuth, BASE_CITY_DEFAULT.allowVkAuth)
    ),
    index:
      typeof city?.index === 'number'
        ? city.index
        : typeof fallback?.index === 'number'
          ? fallback.index
          : 0,
  }
}

export const normalizeCitiesList = (cities) => {
  const source = Array.isArray(cities) ? cities : []
  const map = new Map()

  DEFAULT_CORE_CITIES.forEach((city) => {
    const normalized = normalizeCity(city, city)
    if (normalized) map.set(normalized.slug, normalized)
  })

  source.forEach((city, idx) => {
    const normalized = normalizeCity(city, { index: idx })
    if (normalized) {
      const previous = map.get(normalized.slug)
      map.set(
        normalized.slug,
        normalizeCity(normalized, previous || { index: map.size })
      )
    }
  })

  const result = Array.from(map.values()).sort(
    (a, b) => (a.index ?? 0) - (b.index ?? 0)
  )

  return result.map((city, index) => ({
    ...city,
    index,
  }))
}

export const buildCityPoliciesFromCities = (cities = []) => {
  const policies = {}

  cities.forEach((city) => {
    if (!city?.slug) return
    policies[city.slug] = {
      status: normalizeCityStatus(city.status, 'active'),
      allowRegistration: normalizeBoolean(city.allowRegistration, true),
      allowLogin: normalizeBoolean(city.allowLogin, true),
      allowEventSignup: normalizeBoolean(city.allowEventSignup, true),
      allowEventManagement: normalizeBoolean(city.allowEventManagement, true),
      allowPublicListing: normalizeBoolean(city.allowPublicListing, true),
      allowVkAuth: normalizeBoolean(city.allowVkAuth, false),
    }
  })

  return policies
}

export const getCoreLocationSlugs = () => LOCATIONS_KEYS
