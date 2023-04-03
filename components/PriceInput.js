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
  labelContentWidth,
  labelPos,
  disabled,
  paddingY = 'small',
  noMargin,
}) => {
  const rubles = value ? Math.floor(value / 100) : 0
  const cops = value ? Math.floor(value % 100) : 0

  const onChangeUpd = (value, rub = true) => {
    if (!onChange) return
    let newValue
    if (rub) newValue = Number((value > 0 ? value : 0) * 100) + cops
    else newValue = rubles * 100 + Number(value > 0 ? value : 0)
    onChange(String(parseInt(newValue)))
  }

  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      onChange={onChange}
      // copyPasteButtons={copyPasteButtons}
      value={value}
      // style={wrapperStyle}
      labelContentWidth={labelContentWidth}
      labelPos={labelPos}
      fullWidth={false}
      paddingY={paddingY}
      className="w-min"
      noMargin={noMargin}
    >
      {/* <div
        className={cn(
          'flex border rounded',
          required && (!value || value == '0')
            ? ' border-red-700'
            : ' border-gray-400'
        )}
      > */}
      <Input
        // label={label}
        step="100"
        // className="gap-x-0"
        // wrapperClassName="border-0"
        noBorder
        inputClassName="w-20"
        // postfixClassName="rounded-r-none"
        // labelClassName={labelClassName}
        type="number"
        name={name + '₽'}
        value={String(rubles)}
        onChange={(value) => onChangeUpd(value, true)}
        // required={required}
        // inLine={inLine}
        postfix="₽"
        // readOnly={readOnly}
        maxLength={6}
        min={0}
        disabled={disabled}
        fullWidth={false}
        paddingY={false}
        paddingX={false}
        noMargin
        showDisabledIcon={false}
      />
      <Input
        step="10"
        // label={label}
        // className={className}
        noBorder
        // wrapperClassName="w-20 border-l rounded-none rounded-r"
        inputClassName="w-12"
        // labelClassName={labelClassName}
        type="number"
        name={name + 'коп'}
        value={String(cops)}
        onChange={(value) => onChangeUpd(value, false)}
        // required={required}
        // inLine={inLine}
        postfix="коп"
        // readOnly={readOnly}
        maxLength={2}
        min={0}
        disabled={disabled}
        fullWidth={false}
        paddingY={false}
        paddingX={false}
        noMargin
      />
      {/* </div> */}
    </InputWrapper>
  )
}

export default PriceInput
