import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import {
  faCopy,
  faEye,
  faIdCard,
  faEyeSlash,
  faTrashAlt,
  faCalendarPlus,
} from '@fortawesome/free-regular-svg-icons'
import cn from 'classnames'
import {
  faArrowDown,
  faArrowUp,
  faCalendarAlt,
  faEllipsisV,
  faMoneyBill,
  faPencilAlt,
  faShareAlt,
  faSignIn,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'

import CardButton from './CardButton'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
import useCopyEventLinkToClipboard from '@helpers/useCopyEventLinkToClipboard'

// import { useDetectClickOutside } from 'react-detect-click-outside'
import windowDimensionsTailwindSelector from '@state/selectors/windowDimensionsTailwindSelector'
import { EVENT_STATUSES, SERVICE_USER_STATUSES } from '@helpers/constants'
import isLoggedUserModerSelector from '@state/selectors/isLoggedUserModerSelector'
import useCopyServiceLinkToClipboard from '@helpers/useCopyServiceLinkToClipboard'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import useCopyUserLinkToClipboard from '@helpers/useCopyUserLinkToClipboard'
import DropDown from './DropDown'
import goToUrlForAddEventToCalendar from '@helpers/goToUrlForAddEventToCalendar'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'

const MenuItem = ({ active, icon, onClick, color = 'red', tooltipText }) => (
  <div
    className={cn(
      `cursor-pointer text-base font-normal px-2 duration-300 flex items-center gap-x-2 h-9 hover:bg-${color}-600 hover:text-white`,
      active ? `bg-${color}-500 text-white` : `bg-white text-${color}-500`
    )}
    onClick={(e) => {
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
  alwaysCompact,
  alwaysCompactOnPhone,
  showEditButton = true,
  showDeleteButton = true,
  onEditQuestionnaire,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const isLoggedUserDev = useRecoilValue(isLoggedUserDevSelector)
  const isLoggedUserModer = useRecoilValue(isLoggedUserModerSelector)
  const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)
  const isLoggedUserMember = useRecoilValue(isLoggedUserMemberSelector)
  const device = useRecoilValue(windowDimensionsTailwindSelector)
  const siteSettings = useRecoilValue(siteSettingsAtom)

  // const [open, setOpen] = useState(false)
  // const [isTriggered, setIsTriggered] = useState(false)
  // const ref = useDetectClickOutside({
  //   onTriggered: () => {
  //     if (!isTriggered && open) {
  //       setOpen(false)
  //       setIsTriggered(true)
  //       const timer = setTimeout(() => {
  //         setIsTriggered(false)
  //         clearTimeout(timer)
  //       }, 300)
  //     }
  //   },
  // })

  const copyEventLink = useCopyEventLinkToClipboard(item._id)
  const copyServiceLink = useCopyServiceLinkToClipboard(item._id)
  const copyUserLink = useCopyUserLinkToClipboard(item._id)

  const show = {
    editQuestionnaire: !!onEditQuestionnaire,
    shareBtn:
      window?.location?.origin &&
      (typeOfItem === 'event' ||
        typeOfItem === 'service' ||
        typeOfItem === 'user'),
    addToCalendar:
      // ADD
      ((siteSettings?.custom?.birthdayUpdate && isLoggedUserMember) ||
        isLoggedUserAdmin) &&
      typeOfItem === 'event',
    eventUsersBtn:
      (isLoggedUserModer || isLoggedUserMember) && typeOfItem === 'event',
    upBtn: !forForm && isLoggedUserAdmin && onUpClick,
    downBtn: !forForm && isLoggedUserAdmin && onDownClick,
    editBtn:
      isLoggedUserDev ||
      (isLoggedUserModer &&
        showEditButton &&
        (typeOfItem !== 'event' || item.status !== 'closed') &&
        (typeOfItem !== 'serviceUser' || item.status !== 'closed')),
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
    userEvents:
      (isLoggedUserModer || isLoggedUserMember) && typeOfItem === 'user',
    userPaymentsBtn: isLoggedUserModer && typeOfItem === 'user',
    loginHistory: isLoggedUserDev && typeOfItem === 'user',
  }

  const numberOfButtons = Object.keys(show).reduce(
    (p, c) => p + (show[c] ? 1 : 0),
    0
  )

  if (numberOfButtons === 0) return null

  const isCompact =
    alwaysCompact ||
    ((numberOfButtons > 3 || alwaysCompactOnPhone) &&
      (device === 'phoneV' || device === 'phoneH' || device === 'tablet'))

  const ItemComponent = isCompact ? MenuItem : CardButton

  const items = (
    <>
      {show.shareBtn && (
        <ItemComponent
          icon={faShareAlt}
          onClick={() => {
            // setOpen(false)
            if (typeOfItem === 'event') {
              isLoggedUserModer
                ? modalsFunc.copyLink({ eventId: item._id })
                : copyEventLink()
              // if (!item.showOnSite)
              //   modalsFunc.add({
              //     title: 'Мероприятие скрыто',
              //     text: `Ссылка скопирована, но обратите внимание, что мероприятие скрыто, поэтому переход по ссылке пользователей с обычными правами доступа невозможен!`,
              //     confirmButtonName: 'Ясно',
              //     showConfirm: true,
              //     showDecline: false,
              //   })
            }
            if (typeOfItem === 'service') {
              isLoggedUserModer
                ? modalsFunc.copyLink({ serviceId: item._id })
                : copyServiceLink()
              // if (!item.showOnSite)
              //   modalsFunc.add({
              //     title: 'Услуга скрыта',
              //     text: `Ссылка скопирована, но обратите внимание, что услуга скрыта, поэтому переход по ссылке пользователей с обычными правами доступа невозможен!`,
              //     confirmButtonName: 'Ясно',
              //     showConfirm: true,
              //     showDecline: false,
              //   })
            }
            if (typeOfItem === 'user') {
              isLoggedUserModer
                ? modalsFunc.copyLink({ userId: item._id })
                : copyUserLink()
            }
          }}
          color="blue"
          tooltipText="Скопировать ссылку на мероприятие"
        />
      )}
      {show.addToCalendar && (
        <ItemComponent
          icon={faCalendarPlus}
          onClick={() => goToUrlForAddEventToCalendar(item)}
          color="purple"
          tooltipText="Добавить в Google календарь"
        />
      )}
      {show.eventUsersBtn && (
        <ItemComponent
          icon={faUsers}
          onClick={() => {
            // setOpen(false)
            modalsFunc.event.users(item._id)
          }}
          color="green"
          tooltipText="Участники мероприятия"
        />
      )}
      {show.loginHistory && (
        <ItemComponent
          icon={faSignIn}
          onClick={() => {
            // setOpen(false)
            modalsFunc.loginHistory.user(item._id)
          }}
          color="purple"
          tooltipText="История авторизаций пользователя"
        />
      )}
      {show.paymentsUsersBtn && (
        <ItemComponent
          icon={faMoneyBill}
          onClick={() => {
            // setOpen(false)
            modalsFunc.event.payments(item._id)
          }}
          color="amber"
          tooltipText="Финансы"
        />
      )}
      {show.userPaymentsBtn && (
        <ItemComponent
          icon={faMoneyBill}
          onClick={() => {
            // setOpen(false)
            modalsFunc.user.payments(item._id)
          }}
          color="amber"
          tooltipText="Финансы"
        />
      )}
      {show.upBtn && (
        <ItemComponent
          icon={faArrowUp}
          onClick={() => {
            // setOpen(false)
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
            // setOpen(false)
            onDownClick()
          }}
          color="gray"
          tooltipText="Переместить ниже"
        />
      )}
      {show.userEvents && (
        <ItemComponent
          icon={faCalendarAlt}
          onClick={() => {
            // setOpen(false)
            modalsFunc[typeOfItem].events(item._id)
          }}
          color="blue"
          tooltipText="Мероприятия с пользователем"
        />
      )}
      {show.editBtn && (
        <ItemComponent
          icon={faPencilAlt}
          onClick={() => {
            // setOpen(false)
            modalsFunc[typeOfItem].edit(item._id)
          }}
          color="orange"
          tooltipText="Редактировать"
        />
      )}
      {show.editQuestionnaire && (
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
            // setOpen(false)
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
            // setOpen(false)
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
                  // setOpen(false)
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
            // setOpen(false)
            modalsFunc[typeOfItem].delete(item._id)
          }}
          color="red"
          tooltipText="Удалить"
        />
      )}
    </>
  )

  // const handleMouseOver = () => {
  //   // if (turnOnHandleMouseOver) {
  //   // setMenuOpen(false)
  //   setOpen(true)
  //   // }
  // }

  return isCompact ? (
    <DropDown
      trigger={
        <div
          className={cn(
            'flex flex-col items-center justify-center cursor-pointer w-9 h-9 text-general'
            // className
          )}
        >
          <FontAwesomeIcon icon={faEllipsisV} className="w-7 h-7" />
        </div>
      }
      className={className}
      menuPadding={false}
      openOnHover
    >
      <div className="overflow-hidden rounded-lg">{items}</div>
    </DropDown>
  ) : (
    // </div>
    //
    //
    // <div
    //   className={cn('relative cursor-pointer group', className)}
    //   onClick={(e) => {
    //     e.stopPropagation()
    //     if (!isTriggered) setOpen(!open)
    //     // setTurnOnHandleMouseOver(false)
    //     // setIsUserMenuOpened(!isUserMenuOpened)
    //     // const timer = setTimeout(() => {
    //     //   setTurnOnHandleMouseOver(true)
    //     //   clearTimeout(timer)
    //     // }, 300)
    //   }}
    // >
    //   <motion.div
    //     className={cn(
    //       'absolute z-50 overflow-hidden w-min top-[2.3rem]',
    //       direction === 'left' ? 'right-0' : 'left-0'
    //     )}
    //     initial={{ height: 0 }}
    //     animate={{ height: open ? 'auto' : 0 }}
    //     transition={{ type: 'tween' }}
    //     onMouseOver={handleMouseOver}
    //     onMouseOut={handleMouseOut}
    //   >
    //     <div ref={ref} className="h-full bg-red-200 border border-gray-200">
    //       {items}
    //     </div>
    //   </motion.div>
    //   <div className="flex items-center justify-center w-9 h-9 text-general group-hover:text-toxic group-hover:scale-110">
    //     <FontAwesomeIcon icon={faEllipsisV} className="w-7 h-7" />
    //   </div>
    // </div>
    <div className={cn('flex', className)}>{items}</div>
  )
}

export default CardButtons
