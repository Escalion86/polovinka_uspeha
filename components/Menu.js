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

const Menu = ({
  trigger,
  triggerWrapperClassName,
  children,
  openOnHover = true,
  closeOnClick = true,
  open,
}) => {
  const [isMenuOpened, setIsMenuOpened] = useState(false)
  const [turnOnHandleMouseOver, setTurnOnHandleMouseOver] = useState(true)

  const handleMouseOver = () => {
    if (openOnHover && turnOnHandleMouseOver) {
      setIsMenuOpened(true)
    }
  }

  const handleMouseOut = () => {
    if (openOnHover) setIsMenuOpened(false)
  }

  return (
    <div
      className="z-50 flex items-start justify-end"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={
        typeof open === 'boolean'
          ? null
          : () => {
              if (closeOnClick) {
                setTurnOnHandleMouseOver(false)
                setIsMenuOpened(!isMenuOpened)
                const timer = setTimeout(() => {
                  setTurnOnHandleMouseOver(true)
                  clearTimeout(timer)
                }, 500)
              }
            }
      }
    >
      <div
        className={cn(
          'relative flex flex-col items-end',
          triggerWrapperClassName
        )}
      >
        <div
          onClick={
            typeof open === 'boolean'
              ? null
              : () => {
                  if (!openOnHover) setIsMenuOpened(!isMenuOpened)
                }
          }
        >
          {trigger}
        </div>
        <motion.div
          className="absolute overflow-hidden duration-300 bg-white border border-gray-800 top-full"
          variants={variants}
          animate={
            typeof open === 'boolean'
              ? open
                ? 'show'
                : 'hide'
              : isMenuOpened
              ? 'show'
              : 'hide'
          }
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
