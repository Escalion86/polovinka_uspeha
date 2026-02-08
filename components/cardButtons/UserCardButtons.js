import CardButtons from '@components/CardButtons'
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons/faEyeSlash'
import { faIdCard } from '@fortawesome/free-regular-svg-icons/faIdCard'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt'
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode'
import { faHistory } from '@fortawesome/free-solid-svg-icons/faHistory'
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey'
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons/faMoneyBill'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import { faShareAlt } from '@fortawesome/free-solid-svg-icons/faShareAlt'
import { faSignIn } from '@fortawesome/free-solid-svg-icons/faSignIn'
import useCopyUserLinkToClipboard from '@helpers/useCopyUserLinkToClipboard'
import useCopyToClipboard from '@helpers/useCopyToClipboard'
import locationAtom from '@state/atoms/locationAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import isLoggedUserPresidentSelector from '@state/selectors/isLoggedUserPresidentSelector'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import { useAtomValue } from 'jotai'

const UserCardButtons = ({
  item,
  showOnSiteOnClick,
  className,
  alwaysCompact,
  alwaysCompactOnPhone,
  showEditButton = true,
  showDeleteButton = true,
  onEditQuestionnaire,
  customButtons = [],
  customOnly = false,
  triggerClassName = '',
}) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const location = useAtomValue(locationAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const isLoggedUserPresident = useAtomValue(isLoggedUserPresidentSelector)
  const isLoggedUserDev = useAtomValue(isLoggedUserDevSelector)

  const copyLink = useCopyUserLinkToClipboard(location, item?._id)
  const copyId = useCopyToClipboard(item?._id, 'ID скопирован в буфер обмена')

  if (!item) return null

  const rule = loggedUserActiveRole?.users
  const isMorePrivelegetUser = !(
    (item.role !== 'dev' || isLoggedUserDev) &&
    (item.role !== 'president' || isLoggedUserPresident)
  )

  const canEdit =
    !isMorePrivelegetUser &&
    showEditButton &&
    item.status !== 'closed' &&
    (rule?.edit || rule === true)
  const canDelete =
    !isMorePrivelegetUser &&
    showDeleteButton &&
    item.status !== 'closed' &&
    (rule?.delete || rule === true)
  const canShowOnSite =
    showOnSiteOnClick && (rule?.seeHidden || rule?.edit || rule === true)

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
    if (typeof window !== 'undefined' && window.location?.origin) {
      buttons.push({
        key: 'share',
        icon: faShareAlt,
        onClick: () => copyLink && copyLink(),
        color: 'blue',
        tooltipText: 'Скопировать ссылку на пользователя',
      })
    }
    if (!isMorePrivelegetUser && rule?.seeActionsHistory) {
      buttons.push({
        key: 'user-actions-history',
        icon: faHistory,
        onClick: () => modalsFunc.user.historyActions(item._id),
        color: 'orange',
        tooltipText: 'Посмотреть историю действий пользователя',
      })
    }
    if (!isMorePrivelegetUser && rule?.seeHistory) {
      buttons.push({
        key: 'history',
        icon: faHistory,
        onClick: () => modalsFunc.user.history(item._id),
        color: 'orange',
        tooltipText: 'Посмотреть историю изменений',
      })
    }
    if (!isMorePrivelegetUser && rule?.seeUserEvents) {
      buttons.push({
        key: 'user-events',
        icon: faCalendarAlt,
        onClick: () => modalsFunc.user.events(item._id),
        color: 'blue',
        tooltipText: 'Мероприятия с пользователем',
      })
    }
    if (!isMorePrivelegetUser && rule?.seeUserPayments) {
      buttons.push({
        key: 'user-payments',
        icon: faMoneyBill,
        onClick: () => modalsFunc.user.payments(item._id),
        color: 'amber',
        tooltipText: 'Финансы',
      })
    }
    if (isLoggedUserDev) {
      buttons.push({
        key: 'login-history',
        icon: faSignIn,
        onClick: () => modalsFunc.loginHistory.user(item._id),
        color: 'purple',
        tooltipText: 'История авторизаций пользователя',
      })
    }
    if (canEdit) {
      buttons.push({
        key: 'edit',
        icon: faPencilAlt,
        onClick: () => modalsFunc.user.edit(item._id),
        color: 'orange',
        tooltipText: 'Редактировать',
      })
    }
    if (!isMorePrivelegetUser && rule?.setPassword) {
      buttons.push({
        key: 'set-password',
        icon: faKey,
        onClick: () => modalsFunc.user.setPassword(item._id),
        color: 'red',
        tooltipText: 'Изменить пароль',
      })
    }
    if (onEditQuestionnaire) {
      buttons.push({
        key: 'edit-questionnaire',
        icon: faIdCard,
        onClick: onEditQuestionnaire,
        color: 'purple',
        tooltipText: 'Редактировать анкету',
      })
    }
    if (canShowOnSite) {
      buttons.push({
        key: 'show-on-site',
        active: !item.showOnSite,
        icon: item.showOnSite ? faEye : faEyeSlash,
        onClick: () => showOnSiteOnClick && showOnSiteOnClick(),
        color: 'purple',
        tooltipText: 'Показывать на сайте',
      })
    }
    if (canDelete) {
      buttons.push({
        key: 'delete',
        icon: faTrashAlt,
        onClick: () => modalsFunc.user.delete(item._id),
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

export default UserCardButtons
