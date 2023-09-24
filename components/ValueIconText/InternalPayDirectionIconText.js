import { PRODUCT_PAY_INTERNAL } from '@helpers/constants'
import ValueIconText from './ValueIconText'

const InternalPayDirectionIconText = ({ value }) => (
  <ValueIconText value={value} array={PRODUCT_PAY_INTERNAL} />
)

export default InternalPayDirectionIconText
