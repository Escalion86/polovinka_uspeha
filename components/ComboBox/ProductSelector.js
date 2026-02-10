import ComboBox from '@components/ComboBox'
import productsAtom from '@state/atoms/productsAtom'
import { useAtomValue } from 'jotai'

const ProductSelector = ({
  value,
  onChange,
  placeholder = 'Не выбрано',
  required,
  error,
  activePlaceholder,
  fullWidth,
}) => {
  const products = useAtomValue(productsAtom)
  const items = products.map((item, index) => ({
    name: item.title,
    value: item._id,
  }))

  return (
    <ComboBox
      label="Товар"
      value={value}
      onChange={onChange}
      items={items}
      placeholder={placeholder}
      activePlaceholder={activePlaceholder}
      smallMargin
      required={required}
      error={error}
      fullWidth={fullWidth}
    />
  )
}

export default ProductSelector
