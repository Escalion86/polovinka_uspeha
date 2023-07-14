import React from 'react'
import cn from 'classnames'

const DropDown = ({
  trigger,
  children,
  menuPadding = 'md',
  menuClassName,
  openOnHover = false,
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
        openOnHover ? '[--trigger:hover] [--strategy:absolute]' : '',
        className
      )}
    >
      <div id="hs-dropdown" className="w-full hs-dropdown-toggle">
        {trigger}
      </div>
      <div
        className={cn(
          'z-50 rounded-lg hs-dropdown-open:flex items-center justify-center hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 hidden opacity-0 bg-white shadow-md dark:bg-gray-800 border border-gray-400 dark:border-gray-700 dark:divide-gray-700',
          openOnHover
            ? 'after:h-4 after:absolute after:-bottom-4 after:left-0 after:w-full before:h-4 before:absolute before:-top-4 before:left-0 before:w-full'
            : '',
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
