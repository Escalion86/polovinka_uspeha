import serviceSelector from '@state/selectors/serviceSelector'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'

const ServiceNameById = ({ serviceId, className }) => {
  const service = useRecoilValue(serviceSelector(serviceId))
  return <div className={cn('leading-4', className)}>{service.title}</div>
}

export default ServiceNameById
