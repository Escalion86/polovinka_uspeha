import React from 'react'
import cn from 'classnames'

const DropDown = ({
  trigger,
  children,
  menuPadding = 'md',
  menuClassName,
  className,
}) => {
  const padding =
    menuPadding === 'md'
      ? 'p-2'
      : menuPadding === 'sm'
      ? 'p-1'
      : menuPadding === 'lg'
      ? 'p-3'
      : ''
  return (
    <div
      className={cn(
        'hs-dropdown relative inline-flex [--placement:bottom] [--auto-close:inside]',
        className
      )}
    >
      <div id="hs-dropdown" className="w-full hs-dropdown-toggle">
        {trigger}
      </div>
      <div
        className={cn(
          'hs-dropdown-open:flex items-center justify-center hs-dropdown-menu p-2 transition-[opacity,margin] duration hs-dropdown-open:opacity-100 hidden opacity-0 z-10 bg-white shadow-md rounded-lg dark:bg-gray-800 border border-gray-400 dark:border-gray-700 dark:divide-gray-700',
          padding,
          menuClassName
        )}
        aria-labelledby="hs-dropdown"
      >
        {children}
      </div>
    </div>
  )
}

export default DropDown
