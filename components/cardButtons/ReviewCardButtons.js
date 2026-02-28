import CardButtons from '@components/CardButtons'
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons/faEyeSlash'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt'
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import useCopyToClipboard from '@helpers/useCopyToClipboard'
import modalsFuncAtom from '@state/modalsFuncAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import { useAtomValue } from 'jotai'

const ReviewCardButtons = ({
  item,
  showOnSiteOnClick,
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

  const rule = loggedUserActiveRole?.generalPage?.reviews
  const canEdit = showEditButton && (rule?.edit || rule === true)
  const canDelete = showDeleteButton && (rule?.delete || rule === true)
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
    if (canEdit && item.status !== 'closed') {
      buttons.push({
        key: 'edit',
        icon: faPencilAlt,
        onClick: () => {
          modalsFunc.review.edit(item._id)
        },
        color: 'orange',
        tooltipText: 'Редактировать',
      })
    }
    if (canShowOnSite) {
      const isVisibleOnSite = Boolean(item.showOnSite)
      buttons.push({
        key: 'show-on-site',
        icon: isVisibleOnSite ? faEyeSlash : faEye,
        onClick: () => {
          showOnSiteOnClick && showOnSiteOnClick()
        },
        color: isVisibleOnSite ? 'purple' : 'green',
        tooltipText: isVisibleOnSite
          ? 'Скрыть на сайте'
          : 'Показать на сайте',
      })
    }
    if (canDelete && item.status !== 'closed') {
      buttons.push({
        key: 'delete',
        icon: faTrashAlt,
        onClick: () => {
          modalsFunc.review.delete(item._id)
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

export default ReviewCardButtons
