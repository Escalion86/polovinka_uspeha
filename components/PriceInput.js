import cn from 'classnames'
import Input from './Input'
import InputWrapper from './InputWrapper'

const PriceInput = ({
  value,
  label = 'Стоимость',
  onChange,
  required = false,
  className,
  labelClassName,
  name = 'price',
  disabled,
  paddingY = false,
  noMargin,
}) => {
  const rubles = value ? Math.floor(value / 100) : 0
  const cops = value ? Math.floor(value % 100) : 0

  const onChangeUpd = (value, rub = true) => {
    if (!onChange) return
    let newValue
    if (rub) newValue = Number((value > 0 ? value : 0) * 100) + cops
    else newValue = rubles * 100 + Number(value > 0 ? value : 0)
    onChange(parseInt(newValue))
  }

  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      value={value}
      fullWidth={false}
      paddingY={paddingY}
      className={cn('w-min', className)}
      noMargin={noMargin}
      required={required}
    >
      <Input
        step="100"
        noBorder
        inputClassName="w-16"
        type="number"
        name={name + '₽'}
        value={String(rubles)}
        onChange={(value) => onChangeUpd(value, true)}
        postfix="₽"
        max={999999}
        min={0}
        disabled={disabled}
        fullWidth={false}
        paddingY={false}
        paddingX={false}
        noMargin
        showDisabledIcon={false}
        showArrows
      />
      <Input
        step="10"
        noBorder
        inputClassName="w-8"
        type="number"
        name={name + 'коп'}
        value={String(cops)}
        onChange={(value) => onChangeUpd(value, false)}
        postfix="коп"
        max={99}
        min={0}
        disabled={disabled}
        showDisabledIcon={false}
        fullWidth={false}
        paddingY={false}
        paddingX={false}
        noMargin
        showArrows={false}
      />
    </InputWrapper>
  )
}

export default PriceInput
