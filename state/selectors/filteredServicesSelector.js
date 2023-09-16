import servicesAtom from '@state/atoms/servicesAtom'
import { selector } from 'recoil'

const filteredServicesSelector = selector({
  key: 'filteredServicesSelector',
  get: ({ get }) => {
    const services = get(servicesAtom)
    return services?.length > 0
      ? services.filter((service) => service.showOnSite)
      : []
  },
})

export default filteredServicesSelector
