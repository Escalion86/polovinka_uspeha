import ValuePicker from '@components/ValuePicker/ValuePicker'
import { RELATIONSHIP_STATUS_MARRIED } from '@helpers/relationshipStatus'
import PropTypes from 'prop-types'

const RELATIONSHIP_VALUES = [
  {
    value: false,
    name: 'Нет пары',
    color: 'general',
  },
  {
    value: true,
    name: 'Есть пара',
    color: 'blue-400',
  },
  {
    value: RELATIONSHIP_STATUS_MARRIED,
    name: 'В браке',
    color: 'blue-400',
  },
]

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
      valuesArray={RELATIONSHIP_VALUES}
      label="Статус отношений"
      onChange={onChange}
      required={required}
      error={error}
    />
  )
}

RelationshipSelector.propTypes = {
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
}

export default RelationshipSelector
