import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { faPaste } from '@fortawesome/free-solid-svg-icons/faPaste'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { textColorClassCalc } from '@helpers/calcLuminance'
import copyToClipboard from '@helpers/copyToClipboard'
import pasteFromClipboard from '@helpers/pasteFromClipboard'
import cn from 'classnames'
import { HexColorPicker } from 'react-colorful'
import DropDown from './DropDown'
import Input from './Input'
import InputWrapper from './InputWrapper'

const ColorPicker = ({
  label = '',
  value,
  onChange,
  required = false,
  labelClassName,
  className,
  disabled = false,
  error,
  fullWidth = false,
  noMargin,
  paddingX = 'small',
  paddingY = 'small',
}) => {
  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      value={value}
      className={cn(fullWidth ? '' : 'w-24', className)}
      required={required}
      fullWidth={fullWidth}
      paddingX={paddingX}
      paddingY={paddingY}
      disabled={disabled}
      noMargin={noMargin}
      error={error}
    >
      <DropDown
        trigger={
          <div
            className={cn(
              'cursor-pointer flex justify-center items-center w-full h-[24px] border border-gray-200 rounded-lg mt-1',
              textColorClassCalc(value)
            )}
            style={{ backgroundColor: value }}
          >
            {value}
          </div>
        }
        className="w-full"
        turnOffAutoClose="inside"
        strategyAbsolute
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
              onClick={() => copyToClipboard(value)}
            />
            <FontAwesomeIcon
              className="w-5 h-5 duration-200 transform cursor-pointer text-general hover:scale-110"
              icon={faPaste}
              onClick={() => pasteFromClipboard(onChange)}
            />
          </div>
        </div>
      </DropDown>
    </InputWrapper>
  )
}

export default ColorPicker
