import cn from 'classnames'
import { forwardRef } from 'react'

const PulseButton = forwardRef(({ title, className, onClick }, ref) => (
  <div className={cn('relative', className)}>
    <div className="absolute top-0 left-0 z-0 w-full h-full rounded-lg animate-ping-light bg-general" />
    <button
      onClick={onClick}
      className="relative z-10 px-4 py-2 text-xl duration-300 border rounded-lg bg-general border-general tablet:w-auto hover:text-general hover:bg-white hover:border-general"
    >
      {title}
    </button>
  </div>
))

export default PulseButton
