import { SOCIALS } from '@helpers/constants'
import ValuePicker from './ValuePicker'

const SocialPicker = ({
  social,
  onChange = null,
  required = false,
  error = false,
  readOnly,
  disabledValues,
  disselectOnSameClick = true,
}) => (
  <ValuePicker
    value={social}
    valuesArray={SOCIALS}
    label="Соц. сеть"
    onChange={onChange}
    name="social"
    required={required}
    error={error}
    disabledValues={disabledValues}
    readOnly={readOnly}
    disselectOnSameClick={disselectOnSameClick}
  />
)

export default SocialPicker
