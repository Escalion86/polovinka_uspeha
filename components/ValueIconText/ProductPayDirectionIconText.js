import { PRODUCT_PAY_DIRECTIONS } from '@helpers/constants'
import ValueIconText from './ValueIconText'

const ProductPayDirectionIconText = ({ value }) => (
  <ValueIconText value={value} array={PRODUCT_PAY_DIRECTIONS} />
)

export default ProductPayDirectionIconText
