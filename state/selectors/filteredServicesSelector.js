import { atom } from 'jotai'

import servicesAtom from '@state/atoms/servicesAtom'

const filteredServicesSelector = atom((get) => {
  const services = get(servicesAtom)
  return services?.length > 0
    ? services.filter((service) => service.showOnSite)
    : []
})

export default filteredServicesSelector
