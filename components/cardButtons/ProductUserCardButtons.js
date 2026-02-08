import CardButtons from '@components/CardButtons'
import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt'
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import useCopyToClipboard from '@helpers/useCopyToClipboard'
import modalsFuncAtom from '@state/modalsFuncAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import { useAtomValue } from 'jotai'

const ProductUserCardButtons = ({
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
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const isLoggedUserDev = useAtomValue(isLoggedUserDevSelector)

  const copyId = useCopyToClipboard(item?._id, 'ID скопирован в буфер обмена')

  if (!item) return null

  const rule = loggedUserActiveRole?.productsUsers
  const canEdit = showEditButton && (rule?.edit || rule === true)
  const canDelete = showDeleteButton && (rule?.delete || rule === true)
  const canClone = showCloneButton && rule?.add

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
        onClick: () => modalsFunc.productUser.edit(item._id),
        color: 'orange',
        tooltipText: 'Редактировать',
      })
    }
    if (canClone) {
      buttons.push({
        key: 'clone',
        icon: faCopy,
        onClick: () => modalsFunc.productUser.add(item._id, itemProps),
        color: 'blue',
        tooltipText: 'Клонировать',
      })
    }
    if (canDelete && item.status !== 'closed') {
      buttons.push({
        key: 'delete',
        icon: faTrashAlt,
        onClick: () => modalsFunc.productUser.delete(item._id),
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

export default ProductUserCardButtons
