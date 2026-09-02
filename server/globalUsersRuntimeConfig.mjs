import { LOCATIONS_KEYS } from './serverConstants.js'

const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on'])
const FALSE_VALUES = new Set(['0', 'false', 'no', 'off'])

const parseBooleanFlag = (value, fallback) => {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()

  if (TRUE_VALUES.has(normalized)) return true
  if (FALSE_VALUES.has(normalized)) return false
  return fallback
}

const parseRolloutLocations = (value) => {
  if (typeof value === 'undefined' || value === null || String(value).trim() === '') {
    return [...LOCATIONS_KEYS]
  }

  return Array.from(
    new Set(
      String(value)
        .split(',')
        .map((location) => location.trim().toLowerCase())
        .filter((location) => LOCATIONS_KEYS.includes(location))
    )
  )
}

export const getGlobalUsersRuntimeConfig = (env = process.env) => {
  const enabled = parseBooleanFlag(env.GLOBAL_USERS_ENABLED, true)
  const rolloutLocations = parseRolloutLocations(
    env.GLOBAL_USERS_ROLLOUT_LOCATIONS
  )

  return {
    enabled,
    rolloutLocations,
    readFromGlobal:
      enabled && parseBooleanFlag(env.GLOBAL_PROFILE_READ_FROM_GLOBAL, true),
    writeToGlobal:
      enabled && parseBooleanFlag(env.GLOBAL_PROFILE_WRITE_TO_GLOBAL, true),
  }
}

export const isGlobalUsersEnabledForLocation = (
  location,
  env = process.env
) => {
  const config = getGlobalUsersRuntimeConfig(env)
  return config.enabled && config.rolloutLocations.includes(location)
}

export const isGlobalUsersReadEnabled = (location, env = process.env) => {
  const config = getGlobalUsersRuntimeConfig(env)
  return config.readFromGlobal && config.rolloutLocations.includes(location)
}

export const isGlobalUsersWriteEnabled = (location, env = process.env) => {
  const config = getGlobalUsersRuntimeConfig(env)
  return config.writeToGlobal && config.rolloutLocations.includes(location)
}
