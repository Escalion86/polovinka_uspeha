import cn from 'classnames'
import { useState } from 'react'
import InputWrapper from './InputWrapper'
import { HexColorPicker } from 'react-colorful'
import DropDown from './DropDown'
import Input from './Input'
import { faCopy, faPaste } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import copyToClipboard from '@helpers/copyToClipboard'
import pasteFromClipboard from '@helpers/pasteFromClipboard'

function calcLuminance(hex) {
  var c = hex.substring(1)
  var rgb = parseInt(c, 16) // convert rrggbb to decimal
  var r = (rgb >> 16) & 0xff // extract red
  var g = (rgb >> 8) & 0xff // extract green
  var b = (rgb >> 0) & 0xff

  return (r * 0.299 + g * 0.587 + b * 0.114) / 256
}

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
            className={cn(
              'cursor-pointer flex justify-center items-center w-full h-[24px] border border-gray-200 rounded-lg mt-1',
              calcLuminance(value) < 0.5 ? 'text-white' : 'text-black'
            )}
            style={{ backgroundColor: value }}
            menuPadding="lg"
            menuClassName="w-[222px] h-[300px]"
          >
            {value}
          </div>
        }
        className="w-full"
      >
        <div className="flex flex-col gap-y-2 w-[200px]">
          <HexColorPicker color={value} onChange={onChange} />
          <div className="flex items-center justify-between gap-x-2 w-[200px]">
            <Input
              value={value}
              onChange={onChange}
              paddingY={false}
              noMargin
              className="max-w-[132px]"
            />
            <FontAwesomeIcon
              className="w-5 h-5 duration-200 transform cursor-pointer text-general hover:scale-110"
              icon={faCopy}
              // size="1x"
              onClick={() => copyToClipboard(value)}
            />
            <FontAwesomeIcon
              className="w-5 h-5 duration-200 transform cursor-pointer text-general hover:scale-110"
              icon={faPaste}
              // size="1x"
              onClick={() => pasteFromClipboard(onChange)}
            />
          </div>
        </div>
      </DropDown>
    </InputWrapper>
  )
}

export default ColorPicker
