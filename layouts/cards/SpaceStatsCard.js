'use client'

import SpaceStatsCardButtons from '@components/cardButtons/SpaceStatsCardButtons'

const SpaceStatsCard = ({
  stat,
  onEdit,
  onMoveUp,
  onMoveDown,
  onClone,
  onDelete,
  showButtons = true,
  reveal = false,
}) => {
  if (!stat) return null

  return (
    <div
      className="relative cursor-pointer rounded-2xl bg-white p-6 shadow-[0_16px_30px_rgba(0,0,0,0.08)]"
      onClick={onEdit}
      {...(reveal ? { 'data-reveal': true } : {})}
    >
      {showButtons ? (
        <div
          className="absolute right-3 top-3"
          onClick={(event) => event.stopPropagation()}
        >
          <SpaceStatsCardButtons
            stat={stat}
            onEdit={onEdit}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onClone={onClone}
            onDelete={onDelete}
          />
        </div>
      ) : null}
      <div className="font-futura font-semibold text-[clamp(40px,5vw,64px)] text-[#6b1f2a]">
        {stat.number}
      </div>
      <div className="mt-2 font-futura text-[24px] leading-relaxed">
        {stat.text}
      </div>
    </div>
  )
}

export default SpaceStatsCard
