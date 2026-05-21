import dbConnectGlobal from '@utils/dbConnectGlobal'
import checkLocationValid from '@server/checkLocationValid'
import {
  CITIES_CONTENT_KEY,
  normalizeCitiesList,
} from '@server/citiesCatalog'
import { CITY_POLICIES_KEY, normalizePolicies } from '@server/getCityPolicy'

const mergeCitiesWithPolicies = (cities, cityPolicies) =>
  (Array.isArray(cities) ? cities : [])
    .map((city) => {
      const policy = cityPolicies?.[city.slug]
      const merged = !policy
        ? city
        : {
        ...city,
        status: policy.status ?? city.status,
        allowRegistration:
          typeof policy.allowRegistration === 'boolean'
            ? policy.allowRegistration
            : city.allowRegistration,
        allowLogin:
          typeof policy.allowLogin === 'boolean'
            ? policy.allowLogin
            : city.allowLogin,
        allowEventSignup:
          typeof policy.allowEventSignup === 'boolean'
            ? policy.allowEventSignup
            : city.allowEventSignup,
        allowEventManagement:
          typeof policy.allowEventManagement === 'boolean'
            ? policy.allowEventManagement
            : city.allowEventManagement,
        allowPublicListing:
          typeof policy.allowPublicListing === 'boolean'
            ? policy.allowPublicListing
            : city.allowPublicListing,
        allowVkAuth:
          typeof policy.allowVkAuth === 'boolean'
            ? policy.allowVkAuth
            : city.allowVkAuth,
        allowTelegramAuth:
          typeof policy.allowTelegramAuth === 'boolean'
            ? policy.allowTelegramAuth
            : city.allowTelegramAuth,
      }

      if (merged?.slug === 'nrsk' && merged?.status !== 'active') {
        return {
          ...merged,
          allowPublicListing: false,
        }
      }

      return merged
    })
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))

const toPublicCity = (city) => ({
  slug: city.slug,
  title: city.title || city.slug,
  status: city.status,
  allowRegistration: Boolean(city.allowRegistration),
  allowLogin: Boolean(city.allowLogin),
  allowEventSignup: Boolean(city.allowEventSignup),
  allowEventManagement: Boolean(city.allowEventManagement),
  allowPublicListing: Boolean(city.allowPublicListing),
  allowTelegramAuth: Boolean(city.allowTelegramAuth),
  isVisibleInPublicSelector: Boolean(city.isVisibleInPublicSelector),
})

const isVisibleInPublic = (city) =>
  city?.isVisibleInPublicSelector &&
  city?.allowPublicListing &&
  city?.status !== 'archived'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      data: {
        error: {
          type: 'METHOD_NOT_ALLOWED',
          message: 'Method not allowed',
        },
      },
    })
  }

  const location = String(req.query?.location || '')
    .trim()
    .toLowerCase()
  if (!checkLocationValid(location)) {
    return res.status(400).json({
      success: false,
      data: {
        error: {
          type: 'VALIDATION_ERROR',
          message: 'Location is invalid',
        },
      },
    })
  }

  const fallbackCities = normalizeCitiesList([])
  const fallbackPolicies = normalizePolicies({})

  const db = await dbConnectGlobal()
  if (!db) {
    const mergedFallback = mergeCitiesWithPolicies(fallbackCities, fallbackPolicies)
    const currentCity =
      mergedFallback.find((city) => city.slug === location) || null
    const visibleCities = mergedFallback.filter(isVisibleInPublic)
    return res.status(200).json({
      success: true,
      data: {
        location,
        city: currentCity ? toPublicCity(currentCity) : null,
        availableForRegistration: visibleCities
          .filter((city) => city.allowRegistration && city.slug !== location)
          .map(toPublicCity),
        availableForLogin: visibleCities
          .filter((city) => city.allowLogin && city.slug !== location)
          .map(toPublicCity),
        availableForEventSignup: visibleCities
          .filter((city) => city.allowEventSignup && city.slug !== location)
          .map(toPublicCity),
        source: 'fallback',
      },
    })
  }

  try {
    const contentModel = db.model('GlobalContent')
    const [citiesDoc, cityPoliciesDoc] = await Promise.all([
      contentModel.findOne({ key: CITIES_CONTENT_KEY }).lean(),
      contentModel.findOne({ key: CITY_POLICIES_KEY }).lean(),
    ])

    const cities = normalizeCitiesList(citiesDoc?.cities)
    const cityPolicies = normalizePolicies(cityPoliciesDoc?.cityPolicies)
    const merged = mergeCitiesWithPolicies(cities, cityPolicies)
    const currentCity = merged.find((city) => city.slug === location) || null
    const visibleCities = merged.filter(isVisibleInPublic)

    return res.status(200).json({
      success: true,
      data: {
        location,
        city: currentCity ? toPublicCity(currentCity) : null,
        availableForRegistration: visibleCities
          .filter((city) => city.allowRegistration && city.slug !== location)
          .map(toPublicCity),
        availableForLogin: visibleCities
          .filter((city) => city.allowLogin && city.slug !== location)
          .map(toPublicCity),
        availableForEventSignup: visibleCities
          .filter((city) => city.allowEventSignup && city.slug !== location)
          .map(toPublicCity),
        source: 'global',
      },
    })
  } catch (error) {
    console.log('Global city access API error:', error)
    const mergedFallback = mergeCitiesWithPolicies(fallbackCities, fallbackPolicies)
    const currentCity =
      mergedFallback.find((city) => city.slug === location) || null
    const visibleCities = mergedFallback.filter(isVisibleInPublic)
    return res.status(200).json({
      success: true,
      data: {
        location,
        city: currentCity ? toPublicCity(currentCity) : null,
        availableForRegistration: visibleCities
          .filter((city) => city.allowRegistration && city.slug !== location)
          .map(toPublicCity),
        availableForLogin: visibleCities
          .filter((city) => city.allowLogin && city.slug !== location)
          .map(toPublicCity),
        availableForEventSignup: visibleCities
          .filter((city) => city.allowEventSignup && city.slug !== location)
          .map(toPublicCity),
        source: 'fallback',
      },
    })
  }
}
