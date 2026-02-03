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
          color: 'blue-400',
        },
        {
          value: false,
          name: 'Нет пары',
          color: 'general',
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
