import dbConnectGlobal from '@utils/dbConnectGlobal'
import { LOCATIONS_KEYS } from './serverConstants'
import checkLocationValid from './checkLocationValid'

const CITY_POLICIES_KEY = 'city-policies'
const CITY_POLICY_STATUSES = ['active', 'closing', 'archived']

const defaultCityPolicy = Object.freeze({
  status: 'active',
  allowRegistration: true,
  allowLogin: true,
  allowEventSignup: true,
  allowEventManagement: true,
  allowPublicListing: true,
  allowVkAuth: false,
})

const LOCATION_POLICY_DEFAULTS = Object.freeze({
  krsk: defaultCityPolicy,
  nrsk: Object.freeze({
    status: 'closing',
    allowRegistration: false,
    allowLogin: true,
    allowEventSignup: false,
    allowEventManagement: false,
    allowPublicListing: true,
    allowVkAuth: false,
  }),
  ekb: defaultCityPolicy,
})

const getFlagValue = (value, fallback = true) => {
  if (typeof value === 'boolean') return value
  return fallback
}

const getStatusValue = (value) => {
  if (CITY_POLICY_STATUSES.includes(value)) return value
  return defaultCityPolicy.status
}

const getLocationDefaultPolicy = (location) =>
  LOCATION_POLICY_DEFAULTS[location] || defaultCityPolicy

const normalizeSinglePolicy = (policy = {}, location = null) => {
  const locationDefaults = getLocationDefaultPolicy(location)

  return {
    status: getStatusValue(policy?.status ?? locationDefaults.status),
    allowRegistration: getFlagValue(
      policy?.allowRegistration,
      locationDefaults.allowRegistration
    ),
    allowLogin: getFlagValue(policy?.allowLogin, locationDefaults.allowLogin),
    allowEventSignup: getFlagValue(
      policy?.allowEventSignup,
      locationDefaults.allowEventSignup
    ),
    allowEventManagement: getFlagValue(
      policy?.allowEventManagement,
      locationDefaults.allowEventManagement
    ),
    allowPublicListing: getFlagValue(
      policy?.allowPublicListing,
      locationDefaults.allowPublicListing
    ),
    allowVkAuth: getFlagValue(policy?.allowVkAuth, locationDefaults.allowVkAuth),
  }
}

const normalizePolicies = (cityPolicies) => {
  const rawPolicies =
    cityPolicies && typeof cityPolicies.toObject === 'function'
      ? cityPolicies.toObject()
      : cityPolicies && typeof cityPolicies === 'object'
        ? cityPolicies
        : {}

  return LOCATIONS_KEYS.reduce((acc, location) => {
    acc[location] = normalizeSinglePolicy(rawPolicies[location], location)
    return acc
  }, {})
}

const getCityPolicy = async (location) => {
  if (!checkLocationValid(location)) {
    return {
      success: false,
      data: {
        error: {
          type: 'INVALID_LOCATION',
          message: 'Location is invalid',
        },
      },
    }
  }

  const db = await dbConnectGlobal()
  if (!db) {
    return {
      success: false,
      data: {
        error: {
          type: 'DB_ERROR',
          message: 'Global DB connection failed',
        },
      },
    }
  }

  try {
    const doc = await db
      .model('GlobalContent')
      .findOne({ key: CITY_POLICIES_KEY })
      .lean()

    const cityPolicies = normalizePolicies(doc?.cityPolicies)

    return {
      success: true,
      data: {
        location,
        policy: cityPolicies[location] || normalizeSinglePolicy({}, location),
        cityPolicies,
      },
    }
  } catch (error) {
    console.log('getCityPolicy error:', error)
    return {
      success: false,
      data: {
        error: {
          type: 'INTERNAL_ERROR',
          message: 'Failed to get city policy',
        },
      },
    }
  }
}

export {
  CITY_POLICIES_KEY,
  CITY_POLICY_STATUSES,
  defaultCityPolicy,
  LOCATION_POLICY_DEFAULTS,
  getLocationDefaultPolicy,
  normalizeSinglePolicy,
  normalizePolicies,
}

export default getCityPolicy
