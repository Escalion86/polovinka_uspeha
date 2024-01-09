import { LOCATIONS } from './constants'

const getLocationProps = (location) => {
  if (!LOCATIONS[location]) return LOCATIONS.krasnoyarsk
  return LOCATIONS[location]
}

export default getLocationProps
