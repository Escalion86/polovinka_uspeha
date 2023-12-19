import ComboBox from '@components/ComboBox'
import { RELATIONSHIP_VALUES } from '@helpers/constants'

const RelationshipSelector = ({
  value,
  onChange,
  placeholder = 'Не выбрано',
  required,
  error,
  activePlaceholder,
  fullWidth,
  className,
}) => {
  return (
    <ComboBox
      label="Статус отношений"
      value={value}
      className={className}
      onChange={onChange}
      items={RELATIONSHIP_VALUES}
      placeholder={placeholder}
      activePlaceholder={activePlaceholder}
      smallMargin
      required={required}
      error={error}
      fullWidth={fullWidth}
    />
  )
}

export default RelationshipSelector
