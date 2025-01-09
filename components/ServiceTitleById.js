import serviceSelector from '@state/selectors/serviceSelector'
import { useAtomValue } from 'jotai'

const ServiceTitleById = ({ serviceId, className }) => {
  const service = useAtomValue(serviceSelector(serviceId))
  return service.title
}

export default ServiceTitleById
