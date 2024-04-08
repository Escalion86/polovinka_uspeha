import PaymentsPayDirectionToggleButtons from '@components/IconToggleButtons/PaymentsPayDirectionToggleButtons'
import PaymentsPayTypeToggleButtons from '@components/IconToggleButtons/PaymentsPayTypeToggleButtons'
import PaymentsSectorToggleButtons from '@components/IconToggleButtons/PaymentsSectorToggleButtons'
import ToggleButtons from '@components/IconToggleButtons/ToggleButtons'
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink'
import { faUnlink } from '@fortawesome/free-solid-svg-icons/faUnlink'

const PaymentsFilter = ({
  value,
  onChange,
  payDirectionValues,
  paySectorValues,
}) => {
  return (
    <>
      {value?.payType && (
        <PaymentsPayTypeToggleButtons
          value={value.payType}
          onChange={(value) =>
            onChange((state) => ({ ...state, payType: value }))
          }
        />
      )}
      {value?.payDirection && (
        <PaymentsPayDirectionToggleButtons
          value={value.payDirection}
          onChange={(value) =>
            onChange((state) => ({ ...state, payDirection: value }))
          }
          acceptedValues={payDirectionValues}
        />
      )}
      {value?.sector && (
        <PaymentsSectorToggleButtons
          value={value.sector}
          onChange={(value) =>
            onChange((state) => ({ ...state, sector: value }))
          }
          acceptedValues={paySectorValues}
        />
      )}
      {value?.linking && (
        <ToggleButtons
          value={value.linking}
          onChange={(value) =>
            onChange((state) => ({ ...state, linking: value }))
          }
          buttonsConfig={[
            {
              name: 'Закрепленные',
              value: 'linked',
              icon: faLink,
              color: 'green-400',
            },
            {
              name: 'Не закрепленные',
              value: 'unlinked',
              icon: faUnlink,
              color: 'red-400',
            },
          ]}
          iconsOnly
        />
      )}
    </>
  )
}

export default PaymentsFilter
