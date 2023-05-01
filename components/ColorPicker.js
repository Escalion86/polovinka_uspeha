import cn from 'classnames'
import { useState } from 'react'
import InputWrapper from './InputWrapper'
import { HexColorPicker } from 'react-colorful'
import DropDown from './DropDown'

const ColorPicker = ({
  label = '',
  value,
  name,
  onChange,
  required = false,
  labelClassName,
  className,
  disabled = false,
  error,
  fullWidth,
  noMargin,
  defaultValue,
}) => {
  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      onChange={onChange}
      copyPasteButtons={false}
      value={value}
      className={cn(fullWidth ? '' : 'w-24', className)}
      required={required}
      fullWidth={fullWidth}
      paddingY="small"
      paddingX="small"
      disabled={disabled}
      noMargin={noMargin}
      error={error}
    >
      <DropDown
        trigger={
          <div
            className="w-full h-[24px] border border-gray-200 rounded-lg mt-1"
            style={{ backgroundColor: value }}
            menuPadding="lg"
            menuClassName="w-[222px] h-[222px]"
          />
        }
        className="w-full"
      >
        <HexColorPicker color={value} onChange={onChange} />
      </DropDown>
    </InputWrapper>
  )
}

export default ColorPicker
