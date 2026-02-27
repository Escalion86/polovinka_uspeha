import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { faPaste } from '@fortawesome/free-solid-svg-icons/faPaste'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import textColorClassCalc from '@helpers/textColorClassCalc'
import copyToClipboard from '@helpers/copyToClipboard'
import pasteFromClipboard from '@helpers/pasteFromClipboard'
import cn from 'classnames'
import { HexColorPicker } from 'react-colorful'
import { useMemo } from 'react'
import DropDown from './DropDown'
import Input from './Input'
import InputWrapper from './InputWrapper'

const toHex = (value) => {
  if (typeof value !== 'string') return '#000000'
  const trimmed = value.trim()

  const shortHexMatch = trimmed.match(/^#([0-9a-fA-F]{3})$/)
  if (shortHexMatch) {
    const [r, g, b] = shortHexMatch[1].split('')
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase()
  }

  const fullHexMatch = trimmed.match(/^#([0-9a-fA-F]{6})$/)
  if (fullHexMatch) {
    return `#${fullHexMatch[1]}`.toUpperCase()
  }

  const rgbMatch = trimmed.match(
    /^rgba?\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})/
  )
  if (rgbMatch) {
    const toHexPart = (n) => {
      const clamped = Math.max(0, Math.min(255, Number(n) || 0))
      return clamped.toString(16).padStart(2, '0')
    }
    return `#${toHexPart(rgbMatch[1])}${toHexPart(rgbMatch[2])}${toHexPart(rgbMatch[3])}`.toUpperCase()
  }

  const cssVarMatch = trimmed.match(/^var\((--[^)]+)\)$/)
  if (cssVarMatch && typeof window !== 'undefined') {
    const cssVarValue = getComputedStyle(document.documentElement)
      .getPropertyValue(cssVarMatch[1])
      .trim()
    if (cssVarValue) return toHex(cssVarValue)
  }

  return '#000000'
}

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
  const hexValue = useMemo(() => toHex(value), [value])

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
        placement="bottom-start"
        fallbackPlacements={['top-start']}
        trigger={
          <div
            className={cn(
              'cursor-pointer flex justify-center items-center w-full h-6 border border-gray-200 rounded-lg mt-1',
              textColorClassCalc(hexValue)
            )}
            style={{ backgroundColor: hexValue }}
          >
            {hexValue}
          </div>
        }
        className="w-full"
        // turnOffAutoClose="inside"
        // strategyAbsolute
      >
        <div className="flex max-w-[calc(100vw-16px)] flex-col gap-y-2 border border-gray-200 bg-white p-2 rounded-md shadow w-[216px]">
          <HexColorPicker color={hexValue} onChange={onChange} />
          <div className="flex items-center justify-between gap-x-2 w-[200px]">
            <Input
              value={hexValue}
              onChange={onChange}
              paddingY={false}
              noMargin
              className="max-w-[110px]"
            />
            <button
              type="button"
              className="flex items-center justify-center transition-transform duration-200 transform rounded w-7 h-7 text-general hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-general"
              onClick={(event) => {
                event.stopPropagation()
                copyToClipboard(hexValue)
              }}
            >
              <FontAwesomeIcon className="w-5 h-5" icon={faCopy} />
            </button>
            <button
              type="button"
              className="flex items-center justify-center transition-transform duration-200 transform rounded w-7 h-7 text-general hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-general"
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
