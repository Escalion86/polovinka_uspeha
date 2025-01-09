import ComboBox from '@components/ComboBox'
import directionsAtom from '@state/atoms/directionsAtom'
import { useAtomValue } from 'jotai'

const DirectionSelector = ({
  value,
  onChange,
  placeholder = 'Не выбрано',
  required,
  error,
  activePlaceholder,
  fullWidth,
}) => {
  const directions = useAtomValue(directionsAtom)
  const items = directions.map((item, index) => ({
    name: item.title,
    value: item._id,
  }))
  return (
    <ComboBox
      label="Направление"
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

export default DirectionSelector
