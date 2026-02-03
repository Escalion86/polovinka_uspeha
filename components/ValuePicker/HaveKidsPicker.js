import ValuePicker from './ValuePicker'

const HaveKidsPicker = ({
  haveKids,
  onChange = null,
  required = false,
  error = false,
}) => (
  <ValuePicker
    value={haveKids}
    valuesArray={[
      { value: false, name: 'Нет', color: 'blue-400' },
      { value: true, name: 'Есть', color: 'blue-400' },
      { value: null, name: 'Не указано', color: 'general' },
    ]}
    label="Есть дети"
    onChange={onChange}
    name="haveKids"
    required={required}
    error={error}
  />
)

export default HaveKidsPicker
