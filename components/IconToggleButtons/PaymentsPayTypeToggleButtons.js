import { PAY_TYPES } from '@helpers/constants'
import ToggleButtons from './ToggleButtons'

const PaymentsPayTypeToggleButtons = ({ value, onChange }) => {
  return (
    <ToggleButtons
      value={value}
      onChange={onChange}
      buttonsConfig={PAY_TYPES}
      iconsOnly
    />
  )
}

export default PaymentsPayTypeToggleButtons
