import CardButtons from '@components/CardButtons'
import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy'
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons/faEyeSlash'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp'
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import useCopyToClipboard from '@helpers/useCopyToClipboard'
import modalsFuncAtom from '@state/modalsFuncAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import { useAtomValue } from 'jotai'

const AdditionalBlockCardButtons = ({
  item,
  itemProps,
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
  customButtons = [],
  customOnly = false,
  triggerClassName = '',
}) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const isLoggedUserDev = useAtomValue(isLoggedUserDevSelector)

  const copyId = useCopyToClipboard(item?._id, 'ID скопирован в буфер обмена')

  if (!item) return null

  const rule = loggedUserActiveRole?.generalPage?.additionalBlocks
  const canEdit = showEditButton && (rule?.edit || rule === true)
  const canDelete = showDeleteButton && (rule?.delete || rule === true)
  const canClone = showCloneButton && rule?.add
  const canShowOnSite =
    showOnSiteOnClick && (rule?.seeHidden || rule?.edit || rule === true)
  const canMove = !forForm && loggedUserActiveRole?.generalPage?.additionalBlocks

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
    if (canMove && onUpClick) {
      buttons.push({
        key: 'move-up',
        icon: faArrowUp,
        onClick: () => onUpClick(),
        color: 'gray',
        tooltipText: 'Переместить выше',
      })
    }
    if (canMove && onDownClick) {
      buttons.push({
        key: 'move-down',
        icon: faArrowDown,
        onClick: () => onDownClick(),
        color: 'gray',
        tooltipText: 'Переместить ниже',
      })
    }
    if (canEdit && item.status !== 'closed') {
      buttons.push({
        key: 'edit',
        icon: faPencilAlt,
        onClick: () => {
          modalsFunc.additionalBlock.edit(item._id)
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
          modalsFunc.additionalBlock.add(item._id, itemProps)
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
    if (canDelete && item.status !== 'closed') {
      buttons.push({
        key: 'delete',
        icon: faTrashAlt,
        onClick: () => {
          modalsFunc.additionalBlock.delete(item._id)
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

export default AdditionalBlockCardButtons
