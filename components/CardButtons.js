import {
  faCalendarPlus,
  faCopy,
  faEye,
  faEyeSlash,
  faIdCard,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons'
import {
  faArrowDown,
  faArrowUp,
  faCalendarAlt,
  faEllipsisV,
  faHistory,
  faKey,
  faMoneyBill,
  faPencilAlt,
  faShareAlt,
  faSignIn,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EVENT_STATUSES, SERVICE_USER_STATUSES } from '@helpers/constants'
import goToUrlForAddEventToCalendar from '@helpers/goToUrlForAddEventToCalendar'
import useCopyEventLinkToClipboard from '@helpers/useCopyEventLinkToClipboard'
import useCopyServiceLinkToClipboard from '@helpers/useCopyServiceLinkToClipboard'
import useCopyUserLinkToClipboard from '@helpers/useCopyUserLinkToClipboard'
import { modalsFuncAtom } from '@state/atoms'
import windowDimensionsTailwindSelector from '@state/selectors/windowDimensionsTailwindSelector'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'
import CardButton from './CardButton'
import DropDown from './DropDown'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'

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

const typeToKey = (type) => {
  if (type === 'serviceUser') return 'servicesUsers'
  if (type === 'productUser') return 'productsUsers'
  return type + 's'
}

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
  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
  const device = useRecoilValue(windowDimensionsTailwindSelector)
  const isLoggedUserMember = useRecoilValue(isLoggedUserMemberSelector)
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

  const key = typeToKey(typeOfItem)
  const rule = ['additionalBlocks', 'directions', 'reviews'].includes(key)
    ? loggedUserActiveRole?.generalPage[key]
    : loggedUserActiveRole[key]

  const upDownSee =
    (!forForm &&
      typeOfItem === 'service' &&
      loggedUserActiveRole.services.edit) ||
    (typeOfItem === 'product' && loggedUserActiveRole.products.edit) ||
    (typeOfItem === 'additionalBlock' &&
      loggedUserActiveRole.generalPage.additionalBlocks) ||
    (typeOfItem === 'direction' && loggedUserActiveRole.generalPage.directions)

  const editSee = item.status !== 'closed' && (rule?.edit || rule === true)
  // (typeOfItem === 'event' && loggedUserActiveRole.events.edit) ||
  // (typeOfItem === 'user' && loggedUserActiveRole.users.edit) ||
  // (typeOfItem === 'service' && loggedUserActiveRole.services.edit) ||
  // (typeOfItem === 'serviceUser' && loggedUserActiveRole.servicesUsers.edit) ||
  // (typeOfItem === 'product' && loggedUserActiveRole.products.edit) ||
  // (typeOfItem === 'productUser' && loggedUserActiveRole.productsUsers.edit) ||
  // (typeOfItem === 'payment' && loggedUserActiveRole.payments.edit) ||
  // (typeOfItem === 'additionalBlock' &&
  // loggedUserActiveRole.generalPage.additionalBlocks) ||
  // (typeOfItem === 'direction' && loggedUserActiveRole.generalPage.directions) ||
  // (typeOfItem === 'review' && loggedUserActiveRole.generalPage.reviews)

  const show = {
    history: typeOfItem === 'event' && loggedUserActiveRole.events.editHistory,
    editQuestionnaire: !!onEditQuestionnaire,
    setPasswordBtn: rule?.setPassword,
    // typeOfItem === 'user' && isLoggedUserSupervisor,
    shareBtn:
      window?.location?.origin &&
      ['event', 'service', 'user', 'product'].includes(typeOfItem),
    addToCalendar: typeOfItem === 'event',
    eventUsersBtn:
      (loggedUserActiveRole.eventsUsers.see || isLoggedUserMember) &&
      typeOfItem === 'event',
    upBtn: onUpClick && upDownSee,
    downBtn: onDownClick && upDownSee,
    editBtn: showEditButton && editSee,
    cloneBtn: !['user', 'review'].includes(typeOfItem) && rule?.edit,
    showOnSiteBtn:
      showOnSiteOnClick && (rule?.seeHidden || rule?.edit || rule === true),
    statusBtn: rule?.statusEdit,
    deleteBtn:
      showDeleteButton &&
      item.status !== 'closed' &&
      (rule?.delete || rule === true),
    paymentsUsersBtn: rule?.paymentsEdit,
    userEvents: rule?.seeUserEvents,
    userPaymentsBtn: rule?.seeUserPayments,
    loginHistory: loggedUserActiveRole.dev && typeOfItem === 'user',
  }

  const numberOfButtons = Object.keys(show).reduce(
    (p, c) => p + (show[c] ? 1 : 0),
    0
  )

  if (numberOfButtons === 0) return null

  const isCompact =
    alwaysCompact ||
    ((numberOfButtons > 4 || alwaysCompactOnPhone) &&
      ['phoneV', 'phoneH', 'tablet'].includes(device))

  const ItemComponent = isCompact ? MenuItem : CardButton

  const items = (
    <>
      {show.shareBtn && (
        <ItemComponent
          icon={faShareAlt}
          onClick={() => {
            // setOpen(false)
            if (typeOfItem === 'event') {
              copyEventLink()
            }
            if (typeOfItem === 'service') {
              copyServiceLink()
            }
            if (typeOfItem === 'user') {
              copyUserLink()
            }
          }}
          color="blue"
          tooltipText={`Скопировать ссылку на ${
            typeOfItem === 'event'
              ? 'мероприятие'
              : typeOfItem === 'user'
              ? 'пользователя'
              : typeOfItem === 'service'
              ? 'услугу'
              : 'продукт'
          }`}
        />
      )}
      {show.history && (
        <ItemComponent
          icon={faHistory}
          onClick={() => modalsFunc.event.history(item._id)}
          color="orange"
          tooltipText="Посмотреть историю изменений"
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
      {show.setPasswordBtn && (
        <ItemComponent
          icon={faKey}
          onClick={() => modalsFunc.user.setPassword(item._id)}
          color="red"
          tooltipText="Изменить пароль"
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
