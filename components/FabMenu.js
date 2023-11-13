import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

const FabItem = ({
  href,
  text,
  onClick,
  icon = faPlus,
  bgClass = 'bg-general',
  show,
}) => {
  const Wrapper = useCallback(
    (props) =>
      href ? (
        <a {...props} href={href} target="_blank" />
      ) : (
        <div {...props} onClick={onClick} />
      ),
    [href]
  )

  return (
    <Wrapper className="flex flex-row-reverse items-center pb-4 duration-300 cursor-pointer hover:brightness-125 min-w-[48px]">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        transition={{ duration: 0.5, delay: show ? 0 : 0.3 }}
        animate={{
          scale: show ? 1 : 0,
          rotate: show ? 0 : -180,
        }}
        className={cn(
          'flex items-center justify-center rounded-full w-[48px] h-[48px] max-h-[48px] max-w-[48px] min-w-[48px] min-h-[48px]',
          // show ? 'delay-0 scale-100' : 'scale-0 delay-300',
          bgClass
        )}
      >
        <FontAwesomeIcon
          className="z-10 w-6 h-6 text-white max-w-6 max-h-6"
          icon={icon}
        />
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        transition={{ duration: 0.3, delay: show ? 0.2 : 0 }}
        animate={{
          width: show ? 'auto' : 0,
        }}
        className={cn('-mr-6 overflow-hidden')}
      >
        <div className="flex w-full max-w-full bg-white border border-general flex-nowrap rounded-l-md">
          <div className="pl-2 font-bold whitespace-nowrap text-general">
            {text}
          </div>
          <div className="bg-white min-w-8" />
        </div>
      </motion.div>
    </Wrapper>
  )
}

const fabs = [
  {
    text: 'Сложности с записью',
    icon: faWhatsapp,
    bgClass: 'bg-green-700',
    href: 'https://wa.me/79504280891',
  },
  {
    text: 'Вопросы по мероприятиям',
    icon: faWhatsapp,
    bgClass: 'bg-green-700',
    href: 'https://wa.me/79504280891',
  },
  {
    text: 'Технические проблемы',
    icon: faWhatsapp,
    bgClass: 'bg-green-700',
    href: 'https://wa.me/79138370020',
  },
]

const FabMenu = ({ show = true, ping = true }) => {
  const [isItemsShowing, setIsItemsShowing] = useState(false)

  const wrapperRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        !event.target.classList.contains('fab')
      )
        setIsItemsShowing(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef])

  return (
    <div
      ref={wrapperRef}
      className={cn(
        'select-none z-10 transition fab duration-300 flex flex-col justify-end fixed right-7 group',
        show
          ? // 'fab-top'
            'bottom-10'
          : '-bottom-20'
      )}
      onClick={() => setIsItemsShowing((state) => !state)}
    >
      <div className="flex flex-col items-end justify-end max-w-12">
        <motion.div
          initial={{ height: 0 }}
          transition={{ duration: 0.3, delay: isItemsShowing ? 0 : 0.3 }}
          animate={{
            height: isItemsShowing ? 'auto' : 0,
          }}
          className={cn(
            'overflow-hidden'
            // isItemsShowing ? 'h-full delay-0' : 'h-0 delay-700'
          )}
        >
          {fabs.map((props, index) => (
            <FabItem key={'fab' + index} {...props} show={isItemsShowing} />
          ))}
        </motion.div>
        <div
          className={cn(
            'relative flex items-center justify-center rounded-full cursor-pointer fab w-[48px] h-[48px] group max-h-[48px] max-w-[48px] bg-general'
          )}
          // onClick={onClick}
          // ref={wrapperRef}
        >
          <FontAwesomeIcon
            className="z-10 w-6 h-6 text-white duration-200 max-w-6 max-h-6 group-hover:scale-125"
            icon={faQuestion}
          />
        </div>
        {ping && (
          <div
            className={cn(
              'absolute animate-ping w-[48px] h-[48px] max-h-[48px] max-w-[48px] rounded-full bg-general'
            )}
          />
        )}
      </div>
    </div>
  )
}

export default FabMenu
