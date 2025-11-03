import { LOCATIONS } from './constantsServer'

const getLocationProps = (location) => {
  if (!LOCATIONS[location]) return

  return LOCATIONS[location]
}

export default getLocationProps
