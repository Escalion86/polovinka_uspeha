import ComboBox from '@components/ComboBox'
import servicesAtom from '@state/atoms/servicesAtom'
import { useAtomValue } from 'jotai'

const ServiceSelector = ({
  value,
  onChange,
  placeholder = 'Не выбрано',
  required,
  error,
  activePlaceholder,
  fullWidth,
}) => {
  const services = useAtomValue(servicesAtom)
  const items = services.map((item, index) => ({
    name: item.title,
    value: item._id,
  }))

  return (
    <ComboBox
      label="Услуга"
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

export default ServiceSelector
