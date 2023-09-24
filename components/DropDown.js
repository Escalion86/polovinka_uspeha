import cn from 'classnames'

const DropDown = ({
  trigger,
  children,
  menuPadding = 'md',
  menuClassName,
  openOnHover = false,
  turnOffAutoClose = false,
  strategyAbsolute = true,
  className,
  placement,
}) => {
  const padding =
    menuPadding === 'md'
      ? 'p-2'
      : menuPadding === 'sm'
      ? 'p-1'
      : menuPadding === 'lg'
      ? 'p-3'
      : ''
  const placementVal =
    placement === 'right' ? 'right-0' : placement === 'left' ? 'left-0' : ''
  // const placementVal =
  //   placement === 'bottom'
  //     ? '[--placement:bottom]'
  //     : placement === 'right'
  //     ? '[--placement:right]'
  //     : placement === 'right-bottom'
  //     ? '[--placement:right-bottom]'
  //     : placement === 'right-top'
  //     ? '[--placement:right-top]'
  //     : placement === 'top'
  //     ? '[--placement:top]'
  //     : ''
  return (
    <div
      className={cn(
        'hs-dropdown relative inline-flex [--placement:bottom]',
        turnOffAutoClose === 'inside'
          ? '[--auto-close:inside]'
          : turnOffAutoClose === 'outside'
          ? '[--auto-close:outside]'
          : '',
        // placementVal,
        openOnHover ? '[--trigger:hover] ' : '',
        strategyAbsolute ? '[--strategy:absolute]' : '',
        className
      )}
      data-prevent-parent-click
    >
      <div id="hs-dropdown" className="w-full hs-dropdown-toggle">
        {trigger}
      </div>
      <div
        className={cn(
          'z-50 rounded-lg hs-dropdown-open:flex items-center justify-center hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 hidden opacity-0 bg-white shadow-md dark:bg-gray-800 border border-gray-400 dark:border-gray-700 dark:divide-gray-700',
          strategyAbsolute
            ? 'after:h-4 after:absolute after:-bottom-4 after:left-0 after:w-full before:h-4 before:absolute before:-top-4 before:left-0 before:w-full'
            : '',
          padding,
          placementVal,
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
