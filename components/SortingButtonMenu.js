import React, { useState } from 'react'
import { motion } from 'framer-motion'
import cn from 'classnames'
import { ValueItem } from './ValuePicker/ValuePicker'
import {
  faSort,
  faSortAlphaAsc,
  faSortAlphaDesc,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const variants = {
  show: {
    scale: 1,
    // width: 'auto',
    // height: 'auto',
    // top: 0,
    // right: 0,
    translateX: 0,
    translateY: 0,
  },
  hide: {
    scale: 0,
    // top: 0,
    // right: 0,
    // width: 0,
    // height: 0,
    translateX: '50%',
    translateY: '-50%',
  },
}

const SortingButtonMenu = () => {
  const [isUserMenuOpened, setIsUserMenuOpened] = useState(false)
  const [turnOnHandleMouseOver, setTurnOnHandleMouseOver] = useState(true)

  const handleMouseOver = () => {
    if (turnOnHandleMouseOver) {
      // setMenuOpen(false)
      setIsUserMenuOpened(true)
    }
  }

  const handleMouseOut = () => setIsUserMenuOpened(false)

  return (
    <div
      className="z-50 flex items-start justify-end h-16"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={() => {
        setTurnOnHandleMouseOver(false)
        setIsUserMenuOpened(!isUserMenuOpened)
        const timer = setTimeout(() => {
          setTurnOnHandleMouseOver(true)
          clearTimeout(timer)
        }, 500)
      }}
    >
      <div className="relative">
        {/* <Avatar user={loggedUser} className="z-10" /> */}
        <motion.div
          className={cn(
            'z-0 absolute flex flex-col top-7 right-0 overflow-hidden duration-300 border border-gray-800'
            // isUserMenuOpened
            //   ? 'scale-100 h-auto translate-y-0 translate-x-0 w-auto'
            //   : 'w-0 h-0 scale-0 translate-x-[40%] -translate-y-1/2'
          )}
          variants={variants}
          animate={isUserMenuOpened ? 'show' : 'hide'}
          initial="hide"
          transition={{ duration: 0.2, type: 'tween' }}
        >
          <div className="relative flex items-center h-8 bg-white">
            <div className="relative flex items-center justify-center w-8 h-8 cursor-pointer group">
              <FontAwesomeIcon icon={faSortAlphaAsc} className="z-10 h-5" />
              <div className="absolute top-0 bottom-0 z-0 w-0 h-8 duration-300 bg-blue-300 rounded-l -right-1 group-hover:w-1/2" />
            </div>
            <div className="z-10 flex items-center justify-center flex-1 h-8 px-1 text-black bg-blue-300 rounded whitespace-nowrap">
              {'по имени'}
            </div>
            <div className="relative flex items-center justify-center w-8 h-8 cursor-pointer group">
              <FontAwesomeIcon icon={faSortAlphaDesc} className="z-10 h-5" />
              <div className="absolute top-0 bottom-0 z-0 w-0 h-8 duration-300 bg-blue-300 rounded-r -left-1 group-hover:w-1/2" />
            </div>
          </div>
        </motion.div>
        <button
          className={cn(
            `h-[30px] z-10 flex min-w-22 duration-300 outline-none items-center justify-center border px-2 py-0.5 rounded cursor-pointer gap-x-2 flex-nowrap border-general`,
            // `group-hover:text-white group-hover:bg-general text-general bg-white`,
            turnOnHandleMouseOver
              ? 'text-white bg-general'
              : 'text-general bg-white'
          )}
          // onClick={() => onClick && onClick()}
        >
          <FontAwesomeIcon icon={faSort} className="h-5" />
          <div
            className={cn(
              'whitespace-nowrap duration-300 select-none',
              // 'group-hover:text-white text-input'
              turnOnHandleMouseOver ? 'text-white' : 'text-input'
            )}
          >
            Сортировка
          </div>
        </button>
      </div>
    </div>
  )
}

export default SortingButtonMenu
