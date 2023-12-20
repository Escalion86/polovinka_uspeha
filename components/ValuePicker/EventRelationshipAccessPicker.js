import { EVENT_RELATIONSHIP_ACCESS } from '@helpers/constants'
import ValuePicker from './ValuePicker'

const EventRelationshipAccessPicker = ({
  relationshipStatus,
  onChange = null,
  required = false,
  disabledValues,
  error = false,
}) => (
  <ValuePicker
    value={relationshipStatus}
    valuesArray={EVENT_RELATIONSHIP_ACCESS}
    label="Доступ в зависимости от статуса отношений"
    onChange={onChange}
    name="status"
    required={required}
    error={error}
    disabledValues={disabledValues}
  />
)

export default EventRelationshipAccessPicker
