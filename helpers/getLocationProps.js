import { LOCATIONS } from './constants'

const getLocationProps = (location) => {
  if (!LOCATIONS[location]) return

  return LOCATIONS[location]
}

export default getLocationProps
