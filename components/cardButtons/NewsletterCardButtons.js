import CardButtons from '@components/CardButtons'
import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt'
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import { faRefresh } from '@fortawesome/free-solid-svg-icons/faRefresh'
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers'
import useCopyToClipboard from '@helpers/useCopyToClipboard'
import modalsFuncAtom from '@state/modalsFuncAtom'
import itemsFuncAtom from '@state/itemsFuncAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import isLoggedUserPresidentSelector from '@state/selectors/isLoggedUserPresidentSelector'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import { useAtomValue } from 'jotai'

const NewsletterCardButtons = ({
  item,
  itemProps,
  className,
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
  const itemsFunc = useAtomValue(itemsFuncAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const isLoggedUserPresident = useAtomValue(isLoggedUserPresidentSelector)
  const isLoggedUserDev = useAtomValue(isLoggedUserDevSelector)

  const copyId = useCopyToClipboard(item?._id, 'ID скопирован в буфер обмена')

  if (!item) return null

  const rule = loggedUserActiveRole?.newsletters
  const canEdit = showEditButton && (rule?.edit || rule === true)
  const canDelete = showDeleteButton && (rule?.delete || rule === true)
  const canClone = showCloneButton && rule?.add
  const canUpdateStatuses = isLoggedUserPresident

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
    if (canEdit && item.status !== 'closed') {
      buttons.push({
        key: 'edit',
        icon: faPencilAlt,
        onClick: () => modalsFunc.newsletter.edit(item._id),
        color: 'orange',
        tooltipText: 'Редактировать',
      })
    }
    if (canClone) {
      buttons.push({
        key: 'clone',
        icon: faCopy,
        onClick: () => modalsFunc.newsletter.add(item._id, itemProps),
        color: 'blue',
        tooltipText: 'Клонировать',
      })
    }
    if (canUpdateStatuses) {
      buttons.push(
        {
          key: 'newsletter-refresh',
          icon: faRefresh,
          onClick: () => itemsFunc.newsletter.refresh(item._id),
          color: 'purple',
          tooltipText: 'Обновить статус отправленных сообщений',
        },
        {
          key: 'newsletter-users',
          icon: faUsers,
          onClick: () => modalsFunc.newsletter.usersView(item._id),
          color: 'green',
          tooltipText: 'Посмотреть получателей',
        }
      )
    }
    if (canDelete && item.status !== 'closed') {
      buttons.push({
        key: 'delete',
        icon: faTrashAlt,
        onClick: () => modalsFunc.newsletter.delete(item._id),
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

export default NewsletterCardButtons
