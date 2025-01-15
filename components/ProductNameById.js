import productSelector from '@state/selectors/productSelector'
import cn from 'classnames'
import { useAtomValue } from 'jotai'

const ProductNameById = ({ productId, className }) => {
  const product = useAtomValue(productSelector(productId))
  return <div className={cn('leading-4', className)}>{product.title}</div>
}

export default ProductNameById
