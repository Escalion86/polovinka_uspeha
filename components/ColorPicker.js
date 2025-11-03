import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { faPaste } from '@fortawesome/free-solid-svg-icons/faPaste'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import textColorClassCalc from '@helpers/textColorClassCalc'
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
        // turnOffAutoClose="inside"
        // strategyAbsolute
      >
        <div className="flex flex-col gap-y-2 border-gray-200 border w-[216px] bg-white p-2 rounded-md shadow">
          <HexColorPicker color={value} onChange={onChange} />
          <div className="flex items-center justify-between gap-x-2 w-[200px]">
            <Input
              value={value}
              onChange={onChange}
              paddingY={false}
              noMargin
              className="max-w-[110px]"
            />
            <button
              type="button"
              className="flex items-center justify-center w-7 h-7 text-general transition-transform duration-200 transform rounded hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-general"
              onClick={(event) => {
                event.stopPropagation()
                copyToClipboard(value)
              }}
            >
              <FontAwesomeIcon className="w-5 h-5" icon={faCopy} />
            </button>
            <button
              type="button"
              className="flex items-center justify-center w-7 h-7 text-general transition-transform duration-200 transform rounded hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-general"
              onClick={(event) => {
                event.stopPropagation()
                pasteFromClipboard(onChange)
              }}
            >
              <FontAwesomeIcon className="w-5 h-5" icon={faPaste} />
            </button>
          </div>
        </div>
      </DropDown>
    </InputWrapper>
  )
}

export default ColorPicker
