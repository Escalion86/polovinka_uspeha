import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import { PAY_TYPES, PAY_TYPES_OBJECT } from '@helpers/constants'
import IconWithTooltip from './IconWithTooltip'

const PayTypeIcon = ({ payment, size }) => {
  const payType = PAY_TYPES.find(
    (payTypeItem) => payTypeItem.value === payment.payType
  )
  return (
    <IconWithTooltip
      icon={payType?.icon ?? faQuestion}
      className={payType ? 'text-' + payType.color : 'text-disabled'}
      tooltip={PAY_TYPES_OBJECT[payType.value]}
      size={size}
    />
  )
}

export default PayTypeIcon
