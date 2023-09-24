import { SERVICE_PAY_DIRECTIONS } from '@helpers/constants'
import ValueIconText from './ValueIconText'

const ServicePayDirectionIconText = ({ value }) => (
  <ValueIconText value={value} array={SERVICE_PAY_DIRECTIONS} />
)

export default ServicePayDirectionIconText
