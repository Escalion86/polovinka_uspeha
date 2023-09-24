import cn from 'classnames'
import { forwardRef } from 'react'

const PulseButton = forwardRef(
  ({ title, className, onClick, noPulse = false }, ref) => (
    <div ref={ref} className={cn('relative', className)}>
      <div
        className={cn(
          'absolute top-0 left-0 z-0 w-full h-full rounded-lg bg-general',
          noPulse ? '' : 'animate-ping-light'
        )}
      />
      <button
        onClick={onClick}
        className="relative z-10 px-4 py-2 text-xl duration-300 border rounded-lg bg-general border-general tablet:w-auto hover:text-general hover:bg-white hover:border-general"
      >
        {title}
      </button>
    </div>
  )
)

export default PulseButton
