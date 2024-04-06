import cn from 'classnames'
import { m } from 'framer-motion'

const ListWrapper = ({ children, className }) => {
  return (
    <m.div
      className={cn(
        'flex-1 w-full overflow-y-scroll overflow-x-hidden',
        className
      )}
      layoutScroll
    >
      {children}
    </m.div>
  )
}

export default ListWrapper
