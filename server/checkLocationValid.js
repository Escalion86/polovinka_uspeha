import { LOCATIONS_KEYS } from './serverConstants'

const checkLocationValid = (location) => {
  if (!location) return false

  return LOCATIONS_KEYS.includes(location)
}

export default checkLocationValid
