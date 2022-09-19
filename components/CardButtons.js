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
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import useSnackbar from '@helpers/useSnackbar'
import useCopyEventLinkToClipboard from '@helpers/useCopyEventLinkToClipboard'

const MenuItem = ({ active, icon, onClick, color = 'red', tooltipText }) => (
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
    <div className="whitespace-nowrap prevent-select-text">{tooltipText}</div>
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
  const isLoggedUserDev = useRecoilValue(isLoggedUserDevSelector)
  const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)
  const isLoggedUserMember = useRecoilValue(isLoggedUserMemberSelector)

  const device = useWindowDimensionsTailwind()

  const copyLink = useCopyEventLinkToClipboard(item._id)

  // const { info } = useSnackbar()

  const [open, setOpen] = useState(false)

  const isCompact = device === 'phoneV' || device === 'phoneH'

  const showAdminButtons = isLoggedUserAdmin

  const numberOfButtons =
    (window?.location?.origin && typeOfItem === 'event' ? 1 : 0) +
    ((showAdminButtons || isLoggedUserMember) && typeOfItem === 'event'
      ? 1
      : 0) +
    (showAdminButtons && onUpClick ? 1 : 0) +
    (showAdminButtons && onDownClick ? 1 : 0) +
    (showAdminButtons ? 1 : 0) +
    (showAdminButtons && typeOfItem !== 'user' && typeOfItem !== 'review'
      ? 1
      : 0) +
    (showAdminButtons && showOnSiteOnClick ? 1 : 0) +
    (showAdminButtons && typeOfItem === 'event' ? 1 : 0) +
    (isLoggedUserDev ? 1 : 0)

  const ItemComponent = numberOfButtons > 3 && isCompact ? MenuItem : CardButton

  const items = (
    <>
      {window?.location?.origin && typeOfItem === 'event' && (
        <ItemComponent
          icon={faShareAlt}
          onClick={() => {
            setOpen(false)
            copyLink()
          }}
          color="blue"
          tooltipText="Скопировать ссылку на мероприятие"
        />
      )}
      {(showAdminButtons || isLoggedUserMember) && typeOfItem === 'event' && (
        <ItemComponent
          icon={faUsers}
          onClick={() => {
            setOpen(false)
            modalsFunc.event.users(item._id)
          }}
          color="green"
          tooltipText="Участники мероприятия"
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
          tooltipText="Переместить выше"
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
          tooltipText="Переместить ниже"
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
          tooltipText="Редактировать"
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
          tooltipText="Клонировать"
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
          tooltipText="Показывать на сайте"
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
          tooltipText={item.status === 'canceled' ? 'Возобновить' : 'Отменить'}
        />
      )}
      {isLoggedUserDev && (
        <ItemComponent
          icon={faTrashAlt}
          onClick={() => {
            setOpen(false)
            modalsFunc[typeOfItem].delete(item._id)
          }}
          color="red"
          tooltipText="Удалить"
        />
      )}
    </>
  )

  return numberOfButtons > 3 && isCompact ? (
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
