import {
  EVENT_PAY_DIRECTIONS,
  SERVICE_PAY_DIRECTIONS,
  PRODUCT_PAY_DIRECTIONS,
  PRODUCT_PAY_INTERNAL,
} from '@helpers/constants'
import ValuePicker from './ValuePicker'

const PayDirectionPicker = ({
  payDirection,
  onChange = null,
  required = false,
  error,
  readOnly,
  sector = 'event',
}) => {
  if (!sector) return null
  const valuesArray =
    sector === 'event'
      ? EVENT_PAY_DIRECTIONS
      : sector === 'service'
      ? SERVICE_PAY_DIRECTIONS
      : sector === 'product'
      ? PRODUCT_PAY_DIRECTIONS
      : sector === 'internal'
      ? PRODUCT_PAY_INTERNAL
      : []
  return (
    <ValuePicker
      value={payDirection}
      valuesArray={valuesArray}
      label="Направление"
      onChange={onChange}
      name="payDirection"
      required={required}
      error={error}
      readOnly={readOnly}
    />
  )
}

export default PayDirectionPicker
