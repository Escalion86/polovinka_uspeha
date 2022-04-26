import { ORIENTATIONS } from '@helpers/constants'
import ValuePicker from './ValuePicker'

const OrientationPicker = ({
  orientation,
  onChange = null,
  required = false,
}) => (
  <ValuePicker
    value={orientation}
    valuesArray={ORIENTATIONS}
    label="Ориентация"
    onChange={onChange}
    name="oriantation"
    required={required}
  />
)

export default OrientationPicker
