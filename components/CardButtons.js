import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import {
  faCopy,
  faEye,
  faEyeSlash,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons'
import cn from 'classnames'
import {
  faArrowDown,
  faArrowUp,
  faBan,
  faEllipsisV,
  faPencilAlt,
  faPlay,
  faShareAlt,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { useWindowDimensionsTailwind } from '@helpers/useWindowDimensions'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import CardButton from './CardButton'
import copyToClipboard from '@helpers/copyToClipboard'
import loggedUserAtom from '@state/atoms/loggedUserAtom'

const MenuItem = ({ active, icon, onClick, color = 'red', dataTip }) => (
  <div
    className={cn(
      `text-base font-normal px-2 duration-300 flex items-center gap-x-2 h-8 hover:bg-${color}-600 hover:text-white`,
      active ? `bg-${color}-500 text-white` : `bg-white text-${color}-500`
    )}
    onClick={(e) => {
      e.stopPropagation()
      onClick && onClick()
    }}
  >
    <FontAwesomeIcon icon={icon} className="w-6 h-6" />
    <div className="whitespace-nowrap prevent-select-text">{dataTip}</div>
  </div>
)

const CardButtons = ({
  item,
  typeOfItem,
  showOnSiteOnClick,
  onUpClick,
  onDownClick,
  className,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const loggedUser = useRecoilValue(loggedUserAtom)

  const device = useWindowDimensionsTailwind()

  const [open, setOpen] = useState(false)

  const isCompact = device === 'phoneV' || device === 'phoneH'

  const showAdminButtons =
    loggedUser?.role === 'admin' || loggedUser?.role === 'dev'

  const isUserMember = loggedUser.status === 'member'

  const ItemComponent = showAdminButtons && isCompact ? MenuItem : CardButton

  const items = (
    <>
      {window?.location?.origin && typeOfItem === 'event' && (
        <ItemComponent
          icon={faShareAlt}
          onClick={() => {
            setOpen(false)
            copyToClipboard(window.location.origin + '/event/' + item._id)
          }}
          color="blue"
          dataTip="Скопировать ссылку на мероприятие"
          popoverText="Ссылка на мероприятие скопирована"
        />
      )}
      {(showAdminButtons || isUserMember) && typeOfItem === 'event' && (
        <ItemComponent
          icon={faUsers}
          onClick={() => {
            setOpen(false)
            // onUpClick()
            modalsFunc.event.users(item._id)
          }}
          color="green"
          dataTip="Участники мероприятия"
        />
      )}
      {showAdminButtons && onUpClick && (
        <ItemComponent
          icon={faArrowUp}
          onClick={() => {
            setOpen(false)
            onUpClick()
          }}
          color="gray"
          dataTip="Переместить выше"
        />
      )}
      {showAdminButtons && onDownClick && (
        <ItemComponent
          icon={faArrowDown}
          onClick={() => {
            setOpen(false)
            onDownClick()
          }}
          color="gray"
          dataTip="Переместить ниже"
        />
      )}
      {showAdminButtons && (
        <ItemComponent
          icon={faPencilAlt}
          onClick={() => {
            setOpen(false)
            modalsFunc[typeOfItem].edit(item._id)
          }}
          color="orange"
          dataTip="Редактировать"
        />
      )}
      {showAdminButtons && typeOfItem !== 'user' && typeOfItem !== 'review' && (
        <ItemComponent
          icon={faCopy}
          onClick={() => {
            setOpen(false)
            modalsFunc[typeOfItem].add(item._id)
          }}
          color="blue"
          dataTip="Клонировать"
        />
      )}
      {showAdminButtons && showOnSiteOnClick && (
        <ItemComponent
          active={!item.showOnSite}
          icon={item.showOnSite ? faEye : faEyeSlash}
          onClick={() => {
            setOpen(false)
            showOnSiteOnClick()
          }}
          color="purple"
          dataTip="Показывать на сайте"
        />
      )}
      {showAdminButtons && typeOfItem === 'event' && (
        <ItemComponent
          icon={item.status === 'canceled' ? faPlay : faBan}
          onClick={() => {
            setOpen(false)
            if (item.status === 'canceled')
              modalsFunc[typeOfItem].uncancel(item._id)
            else modalsFunc[typeOfItem].cancel(item._id)
          }}
          color={item.status === 'canceled' ? 'green' : 'red'}
          dataTip={item.status === 'canceled' ? 'Возобновить' : 'Отменить'}
        />
      )}
      {loggedUser?.role === 'dev' && showAdminButtons && (
        <ItemComponent
          icon={faTrashAlt}
          onClick={() => {
            setOpen(false)
            modalsFunc[typeOfItem].delete(item._id)
          }}
          color="red"
          dataTip="Удалить"
        />
      )}
    </>
  )

  return showAdminButtons && isCompact ? (
    <div
      className={cn('relative', className)}
      onClick={(e) => {
        e.stopPropagation()
        setOpen((state) => !state)
      }}
    >
      <motion.div
        className="absolute right-0 z-50 overflow-hidden w-min top-8"
        initial={{ height: 0 }}
        animate={{ height: open ? 'auto' : 0 }}
        transition={{ type: 'tween' }}
      >
        <div className="h-full bg-red-200 border border-gray-200">{items}</div>
      </motion.div>
      <div className="flex items-center justify-center w-8 h-8 text-general">
        <FontAwesomeIcon icon={faEllipsisV} className="w-6 h-6" />
      </div>
    </div>
  ) : (
    <div className={cn('flex', className)}>{items}</div>
  )
}

export default CardButtons
