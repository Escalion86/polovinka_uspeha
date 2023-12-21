// import ComboBox from '@components/ComboBox'
// import { RELATIONSHIP_VALUES } from '@helpers/constants'

import ValuePicker from '@components/ValuePicker/ValuePicker'

const RelationshipSelector = ({
  value,
  onChange,
  required,
  error,
  className,
}) => {
  return (
    <ValuePicker
      className={className}
      value={value}
      valuesArray={[
        {
          value: true,
          name: 'Есть пара',
          color: 'green-400',
        },
        {
          value: false,
          name: 'Нет пары',
          color: 'blue-400',
        },
      ]}
      label="Статус отношений"
      onChange={onChange}
      required={required}
      error={error}
    />
  )
}

export default RelationshipSelector
