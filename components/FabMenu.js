import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import cn from 'classnames'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import TelegramIcon from 'svg/TelegramIcon'

const FabItem = ({ text, whatsapp, telegram, show }) => (
  <div className="relative flex flex-row-reverse gap-x-2 items-center pb-4 min-w-[48px]">
    <div className="flex items-center justify-center gap-x-2">
      {whatsapp && (
        <a
          className="z-10 duration-300 hover:brightness-125"
          target="_blank"
          href={'https://wa.me/' + whatsapp}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            transition={{ duration: 0.5, delay: show ? 0 : 0.3 }}
            animate={{
              scale: show ? 1 : 0,
              rotate: show ? 0 : -180,
            }}
            className={cn(
              'flex items-center justify-center rounded-full w-[48px] h-[48px] max-h-[48px] max-w-[48px] min-w-[48px] min-h-[48px]',
              'bg-green-700'
            )}
          >
            <FontAwesomeIcon
              className="z-10 text-white w-7 h-7 max-w-7 max-h-7"
              icon={faWhatsapp}
            />
          </motion.div>
        </a>
      )}
      {telegram && (
        <a
          className="z-10 duration-300 hover:brightness-125"
          target="_blank"
          href={'https://t.me/' + telegram}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            transition={{ duration: 0.5, delay: show ? 0 : 0.3 }}
            animate={{
              scale: show ? 1 : 0,
              rotate: show ? 0 : -180,
            }}
            className={cn(
              'flex items-center justify-center rounded-full w-[48px] h-[48px] max-h-[48px] max-w-[48px] min-w-[48px] min-h-[48px]',
              'bg-blue-500'
            )}
          >
            <TelegramIcon width={28} height={28} className="-ml-0.5 mt-0.5" />
          </motion.div>
        </a>
      )}
    </div>
    <motion.div
      initial={{ width: 0 }}
      transition={{ duration: 0.3, delay: show ? 0.3 : 0 }}
      animate={{
        width: show ? 'auto' : 0,
      }}
      className={cn('absolute right-6 overflow-hidden')}
    >
      <div className="flex w-full max-w-full bg-white border border-general flex-nowrap rounded-l-md">
        <div className="pl-2 font-bold whitespace-nowrap text-general">
          {text}
        </div>
        <div
          className={cn(
            'bg-white',
            whatsapp && telegram ? 'min-w-22' : 'min-w-8'
          )}
        />
      </div>
    </motion.div>
  </div>
)

const FabMenu = ({ show = true, ping = true }) => {
  const siteSettings = useRecoilValue(siteSettingsAtom)
  const [isItemsShowing, setIsItemsShowing] = useState(false)

  const fabs = siteSettings.fabMenu

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

  if (!fabs?.length > 0) return

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
          transition={{ duration: 0.1, delay: isItemsShowing ? 0 : 0.7 }}
          animate={{
            height: isItemsShowing ? 'auto' : 0,
          }}
        >
          {fabs.map((props, index) => (
            <FabItem key={'fab' + index} {...props} show={isItemsShowing} />
          ))}
        </motion.div>
        <div
          className={cn(
            'z-10 relative flex items-center justify-center rounded-full cursor-pointer fab w-[48px] h-[48px] group max-h-[48px] max-w-[48px] bg-general'
          )}
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
