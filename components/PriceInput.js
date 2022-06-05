import Input from './Input'
import cn from 'classnames'
import InputWrapper from './InputWrapper'

const PriceInput = ({
  value,
  label = 'Стоимость',
  onChange,
  required = false,
  className,
  labelClassName,
  name = 'price',
}) => {
  const rubles = value ? Math.floor(value / 100) : 0
  const cops = value ? Math.floor(value % 100) : 0

  const onChangeUpd = (value, rub = true) => {
    if (!onChange) return
    let newValue
    if (rub) newValue = Number(value * 100) + cops
    else newValue = rubles * 100 + Number(value)

    onChange(newValue)
  }

  return (
    <InputWrapper
      label={label}
      // labelClassName={labelClassName}
      onChange={onChange}
      // copyPasteButtons={copyPasteButtons}
      value={value}
      // style={wrapperStyle}
    >
      <div
        className={cn(
          'flex border rounded',
          required && (!value || value == '0')
            ? ' border-red-700'
            : ' border-gray-400'
        )}
      >
        <Input
          // label={label}
          className="gap-x-0"
          inputClassName="border-0 rounded-none rounded-l w-22"
          postfixClassName="rounded-r-none"
          labelClassName={labelClassName}
          type="number"
          name={name + '₽'}
          value={rubles}
          onChange={(value) => onChangeUpd(value, true)}
          // required={required}
          // inLine={inLine}
          postfix="₽"
          // readOnly={readOnly}
          maxLength={6}
        />
        <Input
          // label={label}
          className={className}
          wrapperClassName="w-16 border-0 border-l rounded-none rounded-r"
          inputClassName="border-0 border-l rounded-l-none rounded-r"
          labelClassName={labelClassName}
          type="number"
          name={name + 'коп'}
          value={cops}
          onChange={(value) => onChangeUpd(value, false)}
          // required={required}
          // inLine={inLine}
          postfix="коп"
          // readOnly={readOnly}
          maxLength={2}
        />
      </div>
    </InputWrapper>
  )
}

export default PriceInput
