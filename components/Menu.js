import { motion } from 'framer-motion'
import { useState } from 'react'
import cn from 'classnames'

const variants = {
  show: {
    scale: 1,
    // width: 'auto',
    // height: 'auto',
    // top: 0,
    right: 0,
    translateX: 0,
    translateY: 0,
  },
  hide: {
    scale: 0,
    // top: 0,
    right: 0,
    // width: 0,
    // height: 0,
    translateX: '50%',
    translateY: '-50%',
  },
}

const Menu = ({ trigger, triggerWrapperClassName, children }) => {
  const [isMenuOpened, setIsMenuOpened] = useState(false)
  const [turnOnHandleMouseOver, setTurnOnHandleMouseOver] = useState(true)

  const handleMouseOver = () => {
    if (turnOnHandleMouseOver) {
      setIsMenuOpened(true)
    }
  }

  const handleMouseOut = () => setIsMenuOpened(false)

  return (
    <div
      className="z-50 flex items-start justify-end"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={() => {
        setTurnOnHandleMouseOver(false)
        setIsMenuOpened(!isMenuOpened)
        const timer = setTimeout(() => {
          setTurnOnHandleMouseOver(true)
          clearTimeout(timer)
        }, 500)
      }}
    >
      <div
        className={cn(
          'relative flex flex-col items-end',
          triggerWrapperClassName
        )}
      >
        {trigger}
        <motion.div
          className="absolute overflow-hidden duration-300 bg-white border border-gray-800 top-full"
          variants={variants}
          animate={isMenuOpened ? 'show' : 'hide'}
          initial="hide"
          transition={{ duration: 0.2, type: 'tween' }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}

export default Menu
