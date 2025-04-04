import { useAtomValue } from 'jotai'

import { faCalendarPlus } from '@fortawesome/free-regular-svg-icons/faCalendarPlus'
import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy'
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons/faEyeSlash'
import { faIdCard } from '@fortawesome/free-regular-svg-icons/faIdCard'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt'
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV'
import { faHeartCirclePlus } from '@fortawesome/free-solid-svg-icons/faHeartCirclePlus'
import { faHistory } from '@fortawesome/free-solid-svg-icons/faHistory'
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey'
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons/faMoneyBill'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import { faShareAlt } from '@fortawesome/free-solid-svg-icons/faShareAlt'
import { faSignIn } from '@fortawesome/free-solid-svg-icons/faSignIn'
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EVENT_STATUSES, SERVICE_USER_STATUSES } from '@helpers/constants'
import goToUrlForAddEventToCalendar from '@helpers/goToUrlForAddEventToCalendar'
import useCopyEventLinkToClipboard from '@helpers/useCopyEventLinkToClipboard'
import useCopyServiceLinkToClipboard from '@helpers/useCopyServiceLinkToClipboard'
import useCopyUserLinkToClipboard from '@helpers/useCopyUserLinkToClipboard'
import modalsFuncAtom from '@state/modalsFuncAtom'
import windowDimensionsTailwindSelector from '@state/selectors/windowDimensionsTailwindSelector'
import cn from 'classnames'
import CardButton from './CardButton'
import DropDown from './DropDown'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
import useCopyToClipboard from '@helpers/useCopyToClipboard'
import { getEventById } from '@helpers/getById'
import locationAtom from '@state/atoms/locationAtom'
import isLoggedUserPresidentSelector from '@state/selectors/isLoggedUserPresidentSelector'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import { faWhatsappSquare } from '@fortawesome/free-brands-svg-icons/faWhatsappSquare'
import { faTelegram } from '@fortawesome/free-brands-svg-icons/faTelegram'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import { faRefresh } from '@fortawesome/free-solid-svg-icons/faRefresh'
import itemsFuncAtom from '@state/itemsFuncAtom'

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
  itemProps, //For clone
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
  showCloneButton = true,
  onEditQuestionnaire,
}) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const itemsFunc = useAtomValue(itemsFuncAtom)
  const location = useAtomValue(locationAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const device = useAtomValue(windowDimensionsTailwindSelector)
  const isLoggedUserMember = useAtomValue(isLoggedUserMemberSelector)
  const isLoggedUserPresident = useAtomValue(isLoggedUserPresidentSelector)
  const isLoggedUserDev = useAtomValue(isLoggedUserDevSelector)
  const siteSettings = useAtomValue(siteSettingsAtom)

  if (!item) return null

  const copyLink = !item?._id
    ? undefined
    : typeOfItem === 'event'
      ? useCopyEventLinkToClipboard(location, item._id)
      : typeOfItem === 'service'
        ? useCopyServiceLinkToClipboard(location, item._id)
        : typeOfItem === 'user'
          ? useCopyUserLinkToClipboard(location, item._id)
          : undefined

  const copyId = useCopyToClipboard(item._id, 'ID скопирован в буфер обмена')
  const key = typeToKey(typeOfItem)
  const rule = ['additionalBlocks', 'directions', 'reviews'].includes(key)
    ? loggedUserActiveRole?.generalPage[key]
    : loggedUserActiveRole[key]

  const isMorePrivelegetUser = !(
    typeOfItem !== 'user' ||
    ((item.role !== 'dev' || isLoggedUserDev) &&
      (item.role !== 'president' || isLoggedUserPresident))
  )

  const upDownSee =
    (!forForm &&
      typeOfItem === 'service' &&
      loggedUserActiveRole?.services?.edit) ||
    (typeOfItem === 'product' && loggedUserActiveRole?.products?.edit) ||
    (typeOfItem === 'additionalBlock' &&
      loggedUserActiveRole?.generalPage?.additionalBlocks) ||
    (typeOfItem === 'direction' &&
      loggedUserActiveRole?.generalPage?.directions)

  const editSee =
    !isMorePrivelegetUser &&
    item.status !== 'closed' &&
    (rule?.edit || rule === true)
  const seeHistory =
    !isMorePrivelegetUser &&
    ((typeOfItem === 'event' && loggedUserActiveRole?.events?.seeHistory) ||
      (typeOfItem === 'payment' &&
        loggedUserActiveRole?.payments?.seeHistory) ||
      (typeOfItem === 'user' && loggedUserActiveRole?.users?.seeHistory))
  const sendNotifications =
    typeOfItem === 'event' &&
    loggedUserActiveRole?.events?.sendNotifications &&
    item.showOnSite
  const sendNotificationsWhatsapp =
    typeOfItem === 'event' &&
    item.showOnSite &&
    siteSettings?.newsletter?.whatsappActivated &&
    loggedUserActiveRole?.newsletters?.add

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
    likes:
      typeOfItem === 'event' &&
      item.likes &&
      loggedUserActiveRole?.events?.editLikes,
    copyId: isLoggedUserDev,
    history: seeHistory,
    userActionsHistory:
      !isMorePrivelegetUser &&
      typeOfItem === 'user' &&
      loggedUserActiveRole?.users?.seeActionsHistory,
    editQuestionnaire: !!onEditQuestionnaire,
    setPasswordBtn: !isMorePrivelegetUser && rule?.setPassword,
    shareBtn:
      window?.location?.origin &&
      ['event', 'service', 'user', 'product'].includes(typeOfItem),
    addToCalendar: typeOfItem === 'event',
    eventUsersBtn:
      (loggedUserActiveRole?.eventsUsers?.see || isLoggedUserMember) &&
      typeOfItem === 'event',
    upBtn: onUpClick && upDownSee,
    downBtn: onDownClick && upDownSee,
    editBtn: showEditButton && editSee,
    cloneBtn:
      showCloneButton && !['user', 'review'].includes(typeOfItem) && rule?.add,
    showOnSiteBtn:
      showOnSiteOnClick && (rule?.seeHidden || rule?.edit || rule === true),
    statusBtn: rule?.statusEdit,
    deleteBtn:
      !isMorePrivelegetUser &&
      showDeleteButton &&
      item.status !== 'closed' &&
      (rule?.delete || rule === true),
    paymentsUsersBtn: rule?.paymentsEdit,
    userEvents: rule?.seeUserEvents,
    userPaymentsBtn: rule?.seeUserPayments,
    loginHistory: isLoggedUserDev && typeOfItem === 'user',
    sendNotifications,
    sendNotificationsWhatsapp,
    updateNewslettersStatuses:
      isLoggedUserPresident && typeOfItem === 'newsletter',
  }

  const numberOfButtons = Object.keys(show).reduce(
    (p, c) => p + (show[c] ? 1 : 0),
    0
  )

  if (numberOfButtons === 0) return null

  const isCompact =
    alwaysCompact ||
    ((numberOfButtons > 3 || alwaysCompactOnPhone) &&
      ['phoneV', 'phoneH', 'tablet'].includes(device))

  const ItemComponent = isCompact ? MenuItem : CardButton

  const items = (
    <>
      {show.copyId && (
        <ItemComponent
          icon={faCode}
          onClick={() => copyId(item._id)}
          color="blue"
          tooltipText="Скопировать ID"
        />
      )}
      {show.shareBtn && (
        <ItemComponent
          icon={faShareAlt}
          onClick={() => {
            if (copyLink) copyLink()
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
      {show.userActionsHistory && (
        <ItemComponent
          icon={faHistory}
          onClick={() => modalsFunc[typeOfItem].historyActions(item._id)}
          color="orange"
          tooltipText="Посмотреть историю действий пользователя"
        />
      )}
      {show.history && (
        <ItemComponent
          icon={faHistory}
          onClick={() => modalsFunc[typeOfItem].history(item._id)}
          color="orange"
          tooltipText="Посмотреть историю изменений"
        />
      )}
      {show.addToCalendar && (
        <ItemComponent
          icon={faCalendarPlus}
          onClick={async () => {
            const event = await getEventById(item._id)
            goToUrlForAddEventToCalendar(event)
          }}
          color="purple"
          tooltipText="Добавить в Google календарь"
        />
      )}
      {show.sendNotificationsWhatsapp && (
        <ItemComponent
          icon={faWhatsappSquare}
          onClick={() => {
            modalsFunc.selectUsersByStatusesFromEvent(
              item._id,
              (users, event) =>
                modalsFunc.newsletter.add(undefined, { users, event })
            )
          }}
          color="green"
          tooltipText="Рассылка"
        />
      )}
      {show.sendNotifications && (
        <ItemComponent
          icon={faTelegram}
          onClick={() => modalsFunc[typeOfItem].notificateAboutEvent(item._id)}
          color="blue"
          tooltipText="Уведомление пользователей о мероприятии"
        />
      )}
      {show.eventUsersBtn && (
        <ItemComponent
          icon={faUsers}
          onClick={() => {
            modalsFunc.event.users(item._id)
          }}
          color="green"
          tooltipText="Участники мероприятия"
        />
      )}
      {show.likes && (
        <ItemComponent
          icon={faHeartCirclePlus}
          onClick={() => modalsFunc.event.viewLikes(item._id)}
          color="pink"
          tooltipText="Лайки участников"
        />
      )}
      {show.loginHistory && (
        <ItemComponent
          icon={faSignIn}
          onClick={() => {
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
            modalsFunc[typeOfItem].add(item._id, itemProps)
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
            showOnSiteOnClick()
          }}
          color="purple"
          tooltipText="Показывать на сайте"
        />
      )}
      {show.updateNewslettersStatuses && (
        <>
          <ItemComponent
            icon={faRefresh}
            onClick={() => {
              itemsFunc.newsletter.refresh(item._id)
            }}
            color="purple"
            tooltipText="Обновить статус отправленных сообщений"
          />
          <ItemComponent
            icon={faUsers}
            onClick={() => {
              modalsFunc.newsletter.usersView(item._id)
            }}
            color="green"
            tooltipText="Посмотреть получателей"
          />
        </>
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
                  modalsFunc[typeOfItem].statusEdit(item._id)
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
            modalsFunc[typeOfItem].delete(item._id)
          }}
          color="red"
          tooltipText="Удалить"
        />
      )}
    </>
  )

  return isCompact ? (
    <div onClick={(e) => e.stopPropagation()}>
      <DropDown
        trigger={
          <div className="flex flex-col items-center justify-center cursor-pointer w-9 h-9 text-general">
            <FontAwesomeIcon icon={faEllipsisV} className="w-7 h-7" />
          </div>
        }
        className={className}
        // menuPadding={false}
        openOnHover
      >
        <div className="overflow-hidden rounded-lg">{items}</div>
      </DropDown>
    </div>
  ) : (
    <div className={cn('flex', className)}>{items}</div>
  )
}

export default CardButtons
