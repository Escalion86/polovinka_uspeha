'use client'

import CardButtons from '@components/CardButtons'
import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import cn from 'classnames'
import DOMPurify from 'isomorphic-dompurify'

const toneClasses = {
  white: 'bg-white text-[#2b1b21]',
  burgundy:
    'bg-[linear-gradient(145deg,#4b101b_0%,#6b1f2a_55%,#7b2a35_100%)] text-white',
  blue: 'bg-[linear-gradient(145deg,#3aa3e0_0%,#4fb0e8_55%,#6bc2f0_100%)] text-[#0b2230]',
}

const toneShadow = {
  white: 'shadow-[0_20px_45px_rgba(0,0,0,0.08)]',
  burgundy: 'shadow-[0_18px_40px_rgba(0,0,0,0.08)]',
  blue: 'shadow-[0_18px_40px_rgba(0,0,0,0.08)]',
}

const toneTrigger = {
  white: 'text-[#6b1f2a]',
  burgundy: 'text-white',
  blue: 'text-[#0b2230]',
}

const hexToRgb = (hex) => {
  if (typeof hex !== 'string') return null
  const cleaned = hex.replace('#', '').trim()
  if (cleaned.length !== 6) return null
  const r = parseInt(cleaned.slice(0, 2), 16)
  const g = parseInt(cleaned.slice(2, 4), 16)
  const b = parseInt(cleaned.slice(4, 6), 16)
  if ([r, g, b].some((val) => Number.isNaN(val))) return null
  return { r, g, b }
}

const getLuminance = (hex) => {
  const rgb = hexToRgb(hex)
  if (!rgb) return 1
  const toLinear = (value) => {
    const v = value / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  const r = toLinear(rgb.r)
  const g = toLinear(rgb.g)
  const b = toLinear(rgb.b)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const getTextTone = (color1, color2) => {
  const lum1 = getLuminance(color1)
  const lum2 = color2 ? getLuminance(color2) : lum1
  const avg = (lum1 + lum2) / 2
  if (avg < 0.5) {
    return { textClass: 'text-white', titleClass: 'text-white' }
  }
  return { textClass: 'text-[#2b1b21]', titleClass: 'text-[#4b0f1c]' }
}

const AboutSpaceCard = ({
  card,
  onEdit,
  onMoveUp,
  onMoveDown,
  onClone,
  onDelete,
}) => {
  if (!card) return null

  const tone = toneClasses[card.tone] ? card.tone : 'white'
  const hasCustomBg =
    (card.bgMode === 'solid' && card.bgColor1) ||
    (card.bgMode === 'gradient' && card.bgColor1 && card.bgColor2)
  const textTone = hasCustomBg
    ? getTextTone(card.bgColor1, card.bgMode === 'gradient' ? card.bgColor2 : null)
    : { textClass: '', titleClass: '' }
  const backgroundStyle = hasCustomBg
    ? card.bgMode === 'gradient'
      ? {
          backgroundImage: `linear-gradient(145deg,${card.bgColor1} 0%, ${card.bgColor2} 100%)`,
        }
      : { backgroundColor: card.bgColor1 }
    : undefined

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
      className={cn(
        'relative rounded-3xl p-6',
        hasCustomBg ? textTone.textClass : toneClasses[tone],
        hasCustomBg ? 'shadow-[0_18px_40px_rgba(0,0,0,0.08)]' : toneShadow[tone],
        card.wide ? 'lg:col-span-2' : ''
      )}
      style={backgroundStyle}
      onClick={onEdit}
    >
      <div
        className="absolute right-3 top-3 z-10"
        onClick={(event) => event.stopPropagation()}
      >
        <CardButtons
          item={card}
          typeOfItem="aboutSpace"
          customButtons={customButtons}
          customOnly
          alwaysCompact
          triggerClassName={
            hasCustomBg
              ? textTone.textClass === 'text-white'
                ? 'text-white'
                : 'text-[#6b1f2a]'
              : toneTrigger[tone]
          }
        />
      </div>
      {card.wide ? (
        <div className="flex flex-col gap-3">
          {card.title ? (
            <h3
              className={cn(
                'text-[18px]',
                hasCustomBg
                  ? textTone.titleClass
                  : tone === 'white'
                    ? 'text-[#4b0f1c]'
                    : ''
              )}
            >
              <strong>{card.title}</strong>
            </h3>
          ) : null}
          <div
            className="about-card-content text-[16px] leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(card.text || ''),
            }}
          />
        </div>
      ) : (
        <div>
          {card.title ? (
            <h3
              className={cn(
                'text-[18px]',
                hasCustomBg
                  ? textTone.titleClass
                  : tone === 'white'
                    ? 'text-[#4b0f1c]'
                    : ''
              )}
            >
              <strong>{card.title}</strong>
            </h3>
          ) : null}
          <div
            className="about-card-content mt-3 text-[16px] leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(card.text || ''),
            }}
          />
        </div>
      )}
    </div>
  )
}

export default AboutSpaceCard
