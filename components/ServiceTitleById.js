import serviceSelector from '@state/selectors/serviceSelector'
import { useRecoilValue } from 'recoil'

const ServiceTitleById = ({ serviceId, className }) => {
  const service = useRecoilValue(serviceSelector(serviceId))
  return service.title
}

export default ServiceTitleById
