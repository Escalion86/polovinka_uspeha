import dbConnectGlobal from '@utils/dbConnectGlobal'
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
      }

      if (merged?.slug === 'nrsk' && merged?.status !== 'active') {
        return {
          ...merged,
          allowPublicListing: false,
        }
      }

      return merged
    })
    .filter(
      (city) =>
        city?.isVisibleInPublicSelector &&
        city?.allowPublicListing &&
        city?.status !== 'archived'
    )
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))

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

  const fallbackCities = normalizeCitiesList([])
  const fallbackPolicies = normalizePolicies({})

  const db = await dbConnectGlobal()
  if (!db) {
    return res.status(200).json({
      success: true,
      data: {
        cities: mergeCitiesWithPolicies(fallbackCities, fallbackPolicies),
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

    return res.status(200).json({
      success: true,
      data: {
        cities: mergeCitiesWithPolicies(cities, cityPolicies),
        source: 'global',
      },
    })
  } catch (error) {
    console.log('Global public cities API error:', error)
    return res.status(200).json({
      success: true,
      data: {
        cities: mergeCitiesWithPolicies(fallbackCities, fallbackPolicies),
        source: 'fallback',
      },
    })
  }
}
