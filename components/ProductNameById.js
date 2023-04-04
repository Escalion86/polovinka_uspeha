import productSelector from '@state/selectors/productSelector'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'

const ProductNameById = ({ productId, className }) => {
  const product = useRecoilValue(productSelector(productId))
  return <div className={cn('leading-4', className)}>{product.title}</div>
}

export default ProductNameById
