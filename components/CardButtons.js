import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import {
  faCopy,
  faEye,
  faIdCard,
  faEyeSlash,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons'
import cn from 'classnames'
import {
  faArrowDown,
  faArrowUp,
  faBan,
  faEllipsisV,
  faMoneyBill,
  faPencilAlt,
  faPlay,
  faShareAlt,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
// import { useWindowDimensionsTailwind } from '@helpers/useWindowDimensions'

import { motion } from 'framer-motion'
import { useState } from 'react'
import CardButton from './CardButton'
// import copyToClipboard from '@helpers/copyToClipboard'
// import loggedUserAtom from '@state/atoms/loggedUserAtom'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
// import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
// import useSnackbar from '@helpers/useSnackbar'
import useCopyEventLinkToClipboard from '@helpers/useCopyEventLinkToClipboard'

import { useDetectClickOutside } from 'react-detect-click-outside'
import windowDimensionsTailwindSelector from '@state/selectors/windowDimensionsTailwindSelector'
import {
  EVENT_STATUSES,
  EVENT_STATUSES_WITH_TIME,
  SERVICE_USER_STATUSES,
} from '@helpers/constants'
import isLoggedUserModerSelector from '@state/selectors/isLoggedUserModerSelector'

const MenuItem = ({ active, icon, onClick, color = 'red', tooltipText }) => (
  <div
    className={cn(
      `text-base font-normal px-2 duration-300 flex items-center gap-x-2 h-9 hover:bg-${color}-600 hover:text-white`,
      active ? `bg-${color}-500 text-white` : `bg-white text-${color}-500`
    )}
    onClick={(e) => {
      e.stopPropagation()
      onClick && onClick()
    }}
  >
    <FontAwesomeIcon icon={icon} className="w-7 h-7" />
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
  forForm,
  direction = 'left',
  alwaysCompact,
  alwaysCompactOnPhone,
  showEditButton = true,
  showDeleteButton = true,
  onEditQuestionnaire,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  // const isLoggedUserDev = useRecoilValue(isLoggedUserDevSelector)
  const isLoggedUserModer = useRecoilValue(isLoggedUserModerSelector)
  const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)
  const isLoggedUserMember = useRecoilValue(isLoggedUserMemberSelector)

  const device = useRecoilValue(windowDimensionsTailwindSelector)

  const copyLink = useCopyEventLinkToClipboard(item._id)

  // const { info } = useSnackbar()

  const [open, setOpen] = useState(false)
  const [isTriggered, setIsTriggered] = useState(false)
  const ref = useDetectClickOutside({
    onTriggered: () => {
      if (!isTriggered && open) {
        setOpen(false)
        setIsTriggered(true)
        const timer = setTimeout(() => {
          setIsTriggered(false)
          clearTimeout(timer)
        }, 300)
      }
    },
  })

  const show = {
    shareBtn: window?.location?.origin && typeOfItem === 'event',
    eventUsersBtn:
      (isLoggedUserModer || isLoggedUserMember) && typeOfItem === 'event',
    upBtn: !forForm && isLoggedUserAdmin && onUpClick,
    downBtn: !forForm && isLoggedUserAdmin && onDownClick,
    editBtn:
      isLoggedUserModer &&
      showEditButton &&
      (typeOfItem !== 'event' || item.status !== 'closed') &&
      (typeOfItem !== 'serviceUser' || item.status !== 'closed'),
    cloneBtn:
      isLoggedUserModer && typeOfItem !== 'user' && typeOfItem !== 'review',
    showOnSiteBtn: isLoggedUserModer && showOnSiteOnClick,
    statusBtn:
      isLoggedUserAdmin &&
      (typeOfItem === 'event' || typeOfItem === 'serviceUser'),
    deleteBtn:
      isLoggedUserAdmin &&
      showDeleteButton &&
      (typeOfItem !== 'event' || item.status !== 'closed') &&
      (typeOfItem !== 'serviceUser' || item.status !== 'closed'),
    paymentsUsersBtn: isLoggedUserAdmin && typeOfItem === 'event',
  }

  const numberOfButtons = Object.keys(show).reduce(
    (p, c) => p + (show[c] ? 1 : 0),
    0
  )

  if (numberOfButtons === 0) return null

  const isCompact =
    alwaysCompact ||
    ((numberOfButtons > 3 || alwaysCompactOnPhone) &&
      (device === 'phoneV' || device === 'phoneH'))

  const ItemComponent = isCompact ? MenuItem : CardButton

  const items = (
    <>
      {show.shareBtn && (
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
      {show.eventUsersBtn && (
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
      {show.paymentsUsersBtn && (
        <ItemComponent
          icon={faMoneyBill}
          onClick={() => {
            setOpen(false)
            modalsFunc.event.payments(item._id)
          }}
          color="amber"
          tooltipText="Финансы"
        />
      )}
      {show.upBtn && (
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
      {show.downBtn && (
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
      {show.editBtn && (
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
      {onEditQuestionnaire && (
        <ItemComponent
          icon={faIdCard}
          onClick={onEditQuestionnaire}
          color="purple"
          tooltipText="Редактировать анкету"
        />
      )}
      {show.cloneBtn && (
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
      {show.showOnSiteBtn && (
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
      {show.statusBtn
        ? (() => {
            const status = item.status ?? 'active'
            const { icon, color, name } = (
              typeOfItem === 'serviceUser'
                ? SERVICE_USER_STATUSES
                : EVENT_STATUSES
            ).find(({ value }) => value === status)
            return (
              <ItemComponent
                icon={icon}
                onClick={() => {
                  setOpen(false)
                  modalsFunc[typeOfItem].statusEdit(item._id)
                  // if (item.status === 'canceled')
                  //   modalsFunc[typeOfItem].uncancel(item._id)
                  // else modalsFunc[typeOfItem].cancel(item._id)
                }}
                color={
                  color.indexOf('-') > 0
                    ? color.slice(0, color.indexOf('-'))
                    : color
                }
                tooltipText={`${name} (изменить статус)`}
              />
            )
          })()
        : null}
      {show.deleteBtn && (
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

  const handleMouseOver = () => {
    // if (turnOnHandleMouseOver) {
    // setMenuOpen(false)
    setOpen(true)
    // }
  }

  const handleMouseOut = () => setOpen(false)

  return isCompact ? (
    <div
      className={cn('relative cursor-pointer group', className)}
      onClick={(e) => {
        e.stopPropagation()
        if (!isTriggered) setOpen(!open)
        // setTurnOnHandleMouseOver(false)
        // setIsUserMenuOpened(!isUserMenuOpened)
        // const timer = setTimeout(() => {
        //   setTurnOnHandleMouseOver(true)
        //   clearTimeout(timer)
        // }, 300)
      }}
    >
      <motion.div
        className={cn(
          'absolute z-50 overflow-hidden w-min top-[2.3rem]',
          direction === 'left' ? 'right-0' : 'left-0'
        )}
        initial={{ height: 0 }}
        animate={{ height: open ? 'auto' : 0 }}
        transition={{ type: 'tween' }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <div ref={ref} className="h-full bg-red-200 border border-gray-200">
          {items}
        </div>
      </motion.div>
      <div className="flex items-center justify-center w-9 h-9 text-general group-hover:text-toxic group-hover:scale-110">
        <FontAwesomeIcon icon={faEllipsisV} className="w-7 h-7" />
      </div>
    </div>
  ) : (
    <div className={cn('flex', className)}>{items}</div>
  )
}

export default CardButtons
