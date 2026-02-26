import CardButtons from '@components/CardButtons'
import { faCalendarPlus } from '@fortawesome/free-regular-svg-icons/faCalendarPlus'
import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy'
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons/faEyeSlash'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt'
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode'
import { faHeartCirclePlus } from '@fortawesome/free-solid-svg-icons/faHeartCirclePlus'
import { faHistory } from '@fortawesome/free-solid-svg-icons/faHistory'
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons/faMoneyBill'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import { faShareAlt } from '@fortawesome/free-solid-svg-icons/faShareAlt'
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers'
import { faBullhorn } from '@fortawesome/free-solid-svg-icons/faBullhorn'
import { EVENT_STATUSES } from '@helpers/constants'
import goToUrlForAddEventToCalendar from '@helpers/goToUrlForAddEventToCalendar'
import useCopyToClipboard from '@helpers/useCopyToClipboard'
import useCityManagementAccess from '@hooks/useCityManagementAccess'
import { getEventById } from '@helpers/getById'
import locationAtom from '@state/atoms/locationAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import { useAtomValue } from 'jotai'

const EventCardButtons = ({
  item,
  itemProps,
  showOnSiteOnClick,
  className,
  forForm,
  alwaysCompact,
  alwaysCompactOnPhone,
  showEditButton = true,
  showDeleteButton = true,
  showCloneButton = true,
  customButtons = [],
  customOnly = false,
  triggerClassName = '',
}) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const location = useAtomValue(locationAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const isLoggedUserMember = useAtomValue(isLoggedUserMemberSelector)
  const isLoggedUserDev = useAtomValue(isLoggedUserDevSelector)
  const { allowEventManagement } = useCityManagementAccess()

  const copyId = useCopyToClipboard(item?._id, 'ID скопирован в буфер обмена')

  if (!item) return null

  const rule = loggedUserActiveRole?.events
  const canEdit =
    allowEventManagement && showEditButton && (rule?.edit || rule === true)
  const canDelete =
    allowEventManagement && showDeleteButton && (rule?.delete || rule === true)
  const canClone = allowEventManagement && showCloneButton && rule?.add
  const canShowOnSite =
    allowEventManagement &&
    showOnSiteOnClick && (rule?.seeHidden || rule?.edit || rule === true)
  const canSeeHistory = loggedUserActiveRole?.events?.seeHistory
  const canSeeUsers =
    loggedUserActiveRole?.eventsUsers?.see || isLoggedUserMember
  const canEditLikes = loggedUserActiveRole?.events?.editLikes
  const canSendNotifications =
    loggedUserActiveRole?.newsletters?.add && item.showOnSite
  const canEditStatus = allowEventManagement && rule?.statusEdit
  const canEditPayments = rule?.paymentsEdit

  const buttons = []

  if (!customOnly) {
    if (isLoggedUserDev) {
      buttons.push({
        key: 'copy-id',
        icon: faCode,
        onClick: () => copyId(item._id),
        color: 'blue',
        tooltipText: 'Скопировать ID',
      })
    }
    buttons.push({
      key: 'share',
      icon: faShareAlt,
      onClick: () => {
        if (typeof window === 'undefined' || !window.location?.origin) return
        const link = `${window.location.origin}/${location}/event/${item._id}`
        modalsFunc.external.qrCodeGenerator({
          title: 'Поделиться мероприятием',
          link,
        })
      },
      color: 'blue',
      tooltipText: 'Поделиться',
    })
    if (canSeeHistory) {
      buttons.push({
        key: 'history',
        icon: faHistory,
        onClick: () => modalsFunc.event.history(item._id),
        color: 'orange',
        tooltipText: 'Посмотреть историю изменений',
      })
    }
    buttons.push({
      key: 'calendar',
      icon: faCalendarPlus,
      onClick: async () => {
        const event = await getEventById(item._id, location)
        goToUrlForAddEventToCalendar(event)
      },
      color: 'purple',
      tooltipText: 'Добавить в Google календарь',
    })
    if (canSendNotifications) {
      buttons.push({
        key: 'send-notifications',
        icon: faBullhorn,
        onClick: () => {
          modalsFunc.selectUsersByStatusesFromEvent(
            item._id,
            (users, event) =>
              modalsFunc.newsletter.add(undefined, { users, event })
          )
        },
        color: 'blue',
        tooltipText: 'Рассылка',
      })
    }
    if (canSeeUsers) {
      buttons.push({
        key: 'event-users',
        icon: faUsers,
        onClick: () => {
          modalsFunc.event.users(item._id)
        },
        color: 'green',
        tooltipText: 'Участники мероприятия',
      })
    }
    if (item.likes && canEditLikes) {
      buttons.push({
        key: 'likes',
        icon: faHeartCirclePlus,
        onClick: () => modalsFunc.event.viewLikes(item._id),
        color: 'pink',
        tooltipText: 'Лайки участников',
      })
    }
    if (canEditPayments) {
      buttons.push({
        key: 'event-payments',
        icon: faMoneyBill,
        onClick: () => {
          modalsFunc.event.payments(item._id)
        },
        color: 'amber',
        tooltipText: 'Финансы',
      })
    }
    if (canEdit) {
      buttons.push({
        key: 'edit',
        icon: faPencilAlt,
        onClick: () => {
          modalsFunc.event.edit(item._id)
        },
        color: 'orange',
        tooltipText: 'Редактировать',
      })
    }
    if (canClone) {
      buttons.push({
        key: 'clone',
        icon: faCopy,
        onClick: () => {
          modalsFunc.event.add(item._id, itemProps)
        },
        color: 'blue',
        tooltipText: 'Клонировать',
      })
    }
    if (canShowOnSite) {
      buttons.push({
        key: 'show-on-site',
        active: !item.showOnSite,
        icon: item.showOnSite ? faEye : faEyeSlash,
        onClick: () => {
          showOnSiteOnClick && showOnSiteOnClick()
        },
        color: 'purple',
        tooltipText: 'Показывать на сайте',
      })
    }
    if (canEditStatus) {
      const status = item.status ?? 'active'
      const { icon, color, name } = EVENT_STATUSES.find(
        ({ value }) => value === status
      )
      buttons.push({
        key: 'status',
        icon,
        onClick: () => {
          modalsFunc.event.statusEdit(item._id)
        },
        color:
          color.indexOf('-') > 0 ? color.slice(0, color.indexOf('-')) : color,
        tooltipText: `${name} (изменить статус)`,
      })
    }
    if (canDelete && item.status !== 'closed') {
      buttons.push({
        key: 'delete',
        icon: faTrashAlt,
        onClick: () => {
          modalsFunc.event.delete(item._id)
        },
        color: 'red',
        tooltipText: 'Удалить',
      })
    }
  }

  const customButtonsArray = Array.isArray(customButtons)
    ? customButtons.filter(Boolean)
    : []

  buttons.push(...customButtonsArray)

  return (
    <CardButtons
      buttons={buttons}
      className={className}
      alwaysCompact={alwaysCompact}
      alwaysCompactOnPhone={alwaysCompactOnPhone}
      triggerClassName={triggerClassName}
    />
  )
}

export default EventCardButtons
