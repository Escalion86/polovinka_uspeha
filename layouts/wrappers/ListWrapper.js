import cn from 'classnames'
import { motion } from 'framer-motion'

const ListWrapper = ({ children, className }) => {
  return (
    <motion.div
      className={cn(
        'flex-1 w-full overflow-y-scroll overflow-x-hidden',
        className
      )}
      layoutScroll
    >
      {children}
    </motion.div>
  )
}

export default ListWrapper
