import cn from 'classnames'
import { useState } from 'react'
import InputWrapper from './InputWrapper'
import { HexColorPicker } from 'react-colorful'

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
      disabled={disabled}
      noMargin={noMargin}
      error={error}
    >
      <div className="hs-dropdown w-full mt-1 relative inline-flex [--placement:bottom] [--auto-close:inside]">
        <div
          id="hs-dropdown-basic"
          className="w-full h-[24px] border border-gray-200 rounded-lg hs-dropdown-toggle"
          style={{ backgroundColor: value }}
        />
        <div
          className="hs-dropdown-open:flex items-center justify-center w-[222px] h-[222px] hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 hidden opacity-0 z-10 bg-white shadow-md rounded-lg dark:bg-gray-800 border border-gray-400 dark:border-gray-700 dark:divide-gray-700"
          aria-labelledby="hs-dropdown-basic"
        >
          <HexColorPicker color={value} onChange={onChange} />
          {/* <a
            class="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            href="#"
          >
            Newsletter
          </a>
          <a
            class="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            href="#"
          >
            Purchases
          </a>
          <a
            class="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            href="#"
          >
            Downloads
          </a>
          <a
            class="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            href="#"
          >
            Team Account
          </a> */}
        </div>
      </div>
    </InputWrapper>
  )
}

export default ColorPicker
