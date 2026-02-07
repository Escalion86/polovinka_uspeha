'use client'

import CardButtons from '@components/CardButtons'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp'
import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt'

const SpaceStatsCard = ({
  stat,
  onEdit,
  onMoveUp,
  onMoveDown,
  onClone,
  onDelete,
}) => {
  if (!stat) return null

  const customButtons = [
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
    <div
      className="relative cursor-pointer rounded-2xl bg-white p-6 shadow-[0_16px_30px_rgba(0,0,0,0.08)]"
      onClick={onEdit}
    >
      <div
        className="absolute right-3 top-3"
        onClick={(event) => event.stopPropagation()}
      >
        <CardButtons
          item={stat}
          typeOfItem="spaceStat"
          customButtons={customButtons}
          customOnly
          alwaysCompact
        />
      </div>
      <div className="font-futura font-semibold text-[clamp(40px,5vw,64px)] text-[#6b1f2a]">
        {stat.number}
      </div>
      <div className="mt-2 font-futura text-[18px] leading-relaxed">
        {stat.text}
      </div>
    </div>
  )
}

export default SpaceStatsCard
