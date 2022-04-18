import {
  faGraduationCap,
  faPencilAlt,
  faPlus,
  faSmile,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MODES } from '@helpers/constants'
import cn from 'classnames'
import { motion } from 'framer-motion'
import { useState } from 'react'

const Fab = ({
  onClick = () => {},
  show = true,
  list = [],
  activeValue = MODES.STUDENT,
}) => {
  const [opened, setOpened] = useState(false)
  const indexOfActiveValue = list.findIndex(
    (item) => activeValue === item.value
  )

  return (
    <div
      className={cn(
        'flex flex-col justify-end absolute right-6 tablet:right-8',
        show && list ? 'tablet:bottom-8 bottom-6' : '-bottom-20'
      )}
      style={{
        minWidth: opened ? 240 : 0,
        minHeight: opened ? list.length * 62 : 0,
      }}
      onMouseEnter={() => setOpened(true)}
      onMouseLeave={() => setOpened(false)}
    >
      <div
        // transition={{ ease: 'linear' }}
        // onBlur={() => setOpened(true)}

        className="relative"
      >
        {list.map((item, index) => (
          <motion.div
            key={item.value}
            onClick={() => {
              console.log('item.value', item.value)
              onClick(item.value)
              setOpened(false)
            }}
            style={{
              minWidth: 56,
              backgroundColor: item.color,
              zIndex: activeValue === item.value ? 999 : 999 - index,
            }}
            initial={{ width: 56 }}
            animate={
              opened
                ? {
                    width: 'auto',
                    opacity: 1,
                    bottom:
                      index === indexOfActiveValue
                        ? 0
                        : (index < indexOfActiveValue ? index + 1 : index) * 64,
                  }
                : {
                    width: 56,
                    bottom: 0,
                    opacity: index === indexOfActiveValue ? 1 : 0,
                  }
            }
            transition={{
              width: { ease: 'linear', delay: opened ? 0.3 : 0 },
              bottom: { delay: opened ? 0 : 0.3 },
              opacity: { delay: opened ? 0 : 0.3 },
            }}
            className={cn(
              'absolute right-0 overflow-hidden flex items-center justify-end text-white rounded-full cursor-pointer h-14 hover:bg-toxic group tablet:h-14'
            )}
          >
            <div className="pl-5 whitespace-nowrap">{item.name}</div>
            <FontAwesomeIcon
              className="z-10 w-5 h-5"
              style={{ minWidth: 56 }}
              icon={item.icon}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Fab
