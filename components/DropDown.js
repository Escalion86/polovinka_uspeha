import useIsTouchDevice from '@helpers/useIsTouchDevice'
import cn from 'classnames'
import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { useState } from 'react'
// import { useRef } from 'react'
const DropDown = ({
  trigger,
  children,
  // menuPadding = 'md',
  // menuClassName,
  openOnHover = false,
  // turnOffAutoClose = false,
  // strategyAbsolute = true,
  className,
  placement = 'left-start',
  closeOnContentClick = false,
  fallbackPlacements,
}) => {
  const isTouchDevice = useIsTouchDevice()
  const [open, setOpen] = useState(false)
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(6),
      flip(
        fallbackPlacements?.length
          ? { fallbackPlacements }
          : undefined
      ),
      shift({ padding: 8, crossAxis: true }),
    ],
  })

  const hover = useHover(context, {
    enabled: openOnHover && !isTouchDevice,
    move: false,
    handleClose: safePolygon({ buffer: 8 }),
  })
  const click = useClick(context, { enabled: !openOnHover || isTouchDevice })
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'menu' })
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    click,
    dismiss,
    role,
  ])
  // const ref = useRef()
  // const padding =
  //   menuPadding === 'md'
  //     ? 'p-2'
  //     : menuPadding === 'sm'
  //       ? 'p-1'
  //       : menuPadding === 'lg'
  //         ? 'p-3'
  //         : ''
  // const placementVal =
  //   placement === 'right' ? 'right-0' : placement === 'left' ? 'left-0' : ''
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
    <div className={cn('bg-transparent border-0', className)}>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {trigger}
      </div>
      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className="z-[9999]"
              {...getFloatingProps()}
            >
              <div
                className="overflow-hidden rounded-lg"
                onClick={() => {
                  if (closeOnContentClick) setOpen(false)
                }}
              >
                {children}
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  )

  // return (
  //   <div
  //     className={cn(
  //       'hs-dropdown relative inline-flex [--placement:bottom]',
  //       turnOffAutoClose === 'inside'
  //         ? '[--auto-close:inside]'
  //         : turnOffAutoClose === 'outside'
  //           ? '[--auto-close:outside]'
  //           : '',
  //       // placementVal,
  //       openOnHover ? '[--trigger:hover] ' : '',
  //       strategyAbsolute ? '[--strategy:absolute]' : '',
  //       className
  //     )}
  //     data-prevent-parent-click
  //   >
  //     <div id="hs-dropdown" className="w-full hs-dropdown-toggle">
  //       {trigger}
  //     </div>
  //     <div
  //       className={cn(
  //         'z-50 rounded-lg hs-dropdown-open:flex items-center justify-center hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 hidden opacity-0 bg-white shadow-md dark:bg-gray-800 border border-gray-400 dark:border-gray-700 dark:divide-gray-700',
  //         strategyAbsolute
  //           ? 'after:h-4 after:absolute after:-bottom-4 after:left-0 after:w-full before:h-4 before:absolute before:-top-4 before:left-0 before:w-full'
  //           : '',
  //         padding,
  //         placementVal,
  //         menuClassName
  //       )}
  //       aria-labelledby="hs-dropdown"
  //     >
  //       {children}
  //     </div>
  //   </div>
  // )
}

export default DropDown
