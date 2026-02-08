import CardButtons from '@components/CardButtons'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt'
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode'
import { faHistory } from '@fortawesome/free-solid-svg-icons/faHistory'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import useCopyToClipboard from '@helpers/useCopyToClipboard'
import modalsFuncAtom from '@state/modalsFuncAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import { useAtomValue } from 'jotai'

const PaymentCardButtons = ({
  item,
  className,
  alwaysCompact,
  alwaysCompactOnPhone,
  showEditButton = true,
  showDeleteButton = true,
  customButtons = [],
  customOnly = false,
  triggerClassName = '',
}) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const isLoggedUserDev = useAtomValue(isLoggedUserDevSelector)

  const copyId = useCopyToClipboard(item?._id, 'ID скопирован в буфер обмена')

  if (!item) return null

  const rule = loggedUserActiveRole?.payments
  const canEdit = showEditButton && (rule?.edit || rule === true)
  const canDelete = showDeleteButton && (rule?.delete || rule === true)
  const canSeeHistory = loggedUserActiveRole?.payments?.seeHistory

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
    if (canSeeHistory) {
      buttons.push({
        key: 'history',
        icon: faHistory,
        onClick: () => modalsFunc.payment.history(item._id),
        color: 'orange',
        tooltipText: 'Посмотреть историю изменений',
      })
    }
    if (canEdit && item.status !== 'closed') {
      buttons.push({
        key: 'edit',
        icon: faPencilAlt,
        onClick: () => modalsFunc.payment.edit(item._id),
        color: 'orange',
        tooltipText: 'Редактировать',
      })
    }
    if (canDelete && item.status !== 'closed') {
      buttons.push({
        key: 'delete',
        icon: faTrashAlt,
        onClick: () => modalsFunc.payment.delete(item._id),
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

export default PaymentCardButtons
