import cn from 'classnames'
import { LayoutGroup, motion } from 'framer-motion'

const CardListWrapper = ({ children, className }) => {
  return (
    <motion.div
      className={cn(
        'flex-1 w-full overflow-y-scroll overflow-x-hidden py-1 bg-opacity-15 bg-general',
        className
      )}
      layoutScroll
    >
      {children}
    </motion.div>
  )
}

export default CardListWrapper
