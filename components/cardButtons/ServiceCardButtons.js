import CardButtons from '@components/CardButtons'
import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy'
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons/faEyeSlash'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp'
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import { faShareAlt } from '@fortawesome/free-solid-svg-icons/faShareAlt'
import useCopyServiceLinkToClipboard from '@helpers/useCopyServiceLinkToClipboard'
import useCopyToClipboard from '@helpers/useCopyToClipboard'
import useCityManagementAccess from '@hooks/useCityManagementAccess'
import modalsFuncAtom from '@state/modalsFuncAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import locationAtom from '@state/atoms/locationAtom'
import { useAtomValue } from 'jotai'

const ServiceCardButtons = ({
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
  const location = useAtomValue(locationAtom)
  const { allowEventManagement } = useCityManagementAccess()

  const copyLink = useCopyServiceLinkToClipboard(location, item?._id)
  const copyId = useCopyToClipboard(item?._id, 'ID скопирован в буфер обмена')

  if (!item) return null

  const rule = loggedUserActiveRole?.services
  const canEdit =
    allowEventManagement && showEditButton && (rule?.edit || rule === true)
  const canDelete =
    allowEventManagement && showDeleteButton && (rule?.delete || rule === true)
  const canClone = allowEventManagement && showCloneButton && rule?.add
  const canShowOnSite =
    allowEventManagement &&
    showOnSiteOnClick && (rule?.seeHidden || rule?.edit || rule === true)
  const canMove =
    allowEventManagement && !forForm && loggedUserActiveRole?.services?.edit

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
        tooltipText: 'Скопировать ссылку на услугу',
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
          modalsFunc.service.edit(item._id)
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
          modalsFunc.service.add(item._id, itemProps)
        },
        color: 'blue',
        tooltipText: 'Клонировать',
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
          modalsFunc.service.delete(item._id)
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

export default ServiceCardButtons
