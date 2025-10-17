import { REFERRAL_REWARD_FOR_VALUES } from '@helpers/constants'
import ValuePicker from './ValuePicker'

const ReferralRewardForPicker = ({
  value,
  onChange,
  required = false,
  error,
  readOnly,
  label = 'Купон предназначен для',
}) => (
  <ValuePicker
    value={value}
    valuesArray={REFERRAL_REWARD_FOR_VALUES}
    label={label}
    onChange={onChange}
    name="referralRewardFor"
    required={required}
    error={error}
    readOnly={readOnly}
  />
)

export default ReferralRewardForPicker
