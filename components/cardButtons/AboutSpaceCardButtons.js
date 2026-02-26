import CardButtons from '@components/CardButtons'
import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'

const AboutSpaceCardButtons = ({
  card,
  onEdit,
  onMoveUp,
  onMoveDown,
  onClone,
  onDelete,
}) => {
  if (!card) return null

  const buttons = [
    {
      key: 'up',
      icon: faArrowUp,
      tooltipText: 'Переместить выше',
      color: 'blue',
      onClick: onMoveUp,
      disabled: !onMoveUp,
    },
    {
      key: 'down',
      icon: faArrowDown,
      tooltipText: 'Переместить ниже',
      color: 'blue',
      onClick: onMoveDown,
      disabled: !onMoveDown,
    },
    {
      key: 'edit',
      icon: faPencilAlt,
      tooltipText: 'Редактировать',
      color: 'green',
      onClick: onEdit,
      disabled: !onEdit,
    },
    {
      key: 'clone',
      icon: faCopy,
      tooltipText: 'Клонировать',
      color: 'general',
      onClick: onClone,
      disabled: !onClone,
    },
    {
      key: 'delete',
      icon: faTrashAlt,
      tooltipText: 'Удалить',
      color: 'red',
      onClick: onDelete,
      disabled: !onDelete,
    },
  ]

  return (
    <CardButtons
      buttons={buttons}
      customOnly
      alwaysCompact
    />
  )
}

export default AboutSpaceCardButtons
