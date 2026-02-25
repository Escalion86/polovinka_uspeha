import { LOCATIONS_KEYS } from './serverConstants'

const LOCATION_TITLES = Object.freeze({
  krsk: 'Красноярск',
  nrsk: 'Норильск',
  ekb: 'Екатеринбург',
})

const DEFAULT_SITE_URL = 'http://localhost:3000'

const normalizeSiteUrl = (value) => {
  const raw = String(value || '').trim()
  if (!raw) return DEFAULT_SITE_URL
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw.replace(/\/+$/, '')
  }

  return `https://${raw.replace(/\/+$/, '')}`
}

export const getSiteUrl = () => normalizeSiteUrl(process.env.DOMAIN)

export const getLocationTitle = (location) =>
  LOCATION_TITLES[location] || String(location || '').toUpperCase()

export const getKnownLocations = () => LOCATIONS_KEYS

