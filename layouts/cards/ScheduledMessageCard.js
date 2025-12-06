import dayjs from 'dayjs'
import CardButtons from '@components/CardButtons'
import CardWrapper from '@components/CardWrapper'
import TextLinesLimiter from '@components/TextLinesLimiter'
import formatDateTime from '@helpers/formatDateTime'
import {
  SCHEDULED_MESSAGE_STATUS_NAME,
  SCHEDULED_MESSAGE_STATUSES,
} from '@helpers/constantsScheduledMessages'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt'
import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy'

const STATUS_BADGE_CLASSES = {
  [SCHEDULED_MESSAGE_STATUSES.DRAFT]: 'bg-yellow-100 text-yellow-800',
  [SCHEDULED_MESSAGE_STATUSES.READY]: 'bg-blue-100 text-blue-800',
  [SCHEDULED_MESSAGE_STATUSES.SENT]: 'bg-green-100 text-green-800',
}

const PREVIEW_MAX_LINES = 3

const getTextPreview = (html) =>
  html
    ? html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+\n/g, '\n')
        .trim()
    : ''

const getLimitedTextPreview = (html) => {
  const preview = getTextPreview(html)
  if (!preview) return ''
  const lines = preview.split('\n')
  if (lines.length <= PREVIEW_MAX_LINES) return preview
  return `${lines.slice(0, PREVIEW_MAX_LINES).join('\n')}...`
}

const getChannelName = (channel) => {
  if (!channel) return 'Канал не указан'
  return channel.name || channel.telegramId || 'Канал не указан'
}

const ScheduledMessageCard = ({
  message,
  onEdit,
  onDelete,
  isDeleting,
  showChannelName = true,
  onClone,
}) => {
  if (!message) return null

  const preview = getLimitedTextPreview(message.text)
  const sendDateTimeString = message.sendDate
    ? `${message.sendDate}${message.sendTime ? ` ${message.sendTime}` : ''}`
    : null
  const sendDateTime = sendDateTimeString
    ? formatDateTime(sendDateTimeString)
    : '-'
  const sendDateMoment = message.sendDate
    ? dayjs(`${message.sendDate} ${message.sendTime || '00:00'}`)
    : null
  const statusClass =
    STATUS_BADGE_CLASSES[message.status] || 'bg-gray-100 text-gray-600'
  const isReadyWithPastDate =
    message.status === SCHEDULED_MESSAGE_STATUSES.READY &&
    sendDateMoment &&
    sendDateMoment.isBefore(dayjs())
  const shouldShowChannel = showChannelName && message.channel
  const customButtons = []
  if (onClone) {
    customButtons.push({
      key: 'clone',
      icon: faCopy,
      onClick: () => onClone(message),
      color: 'blue',
      tooltipText: 'Клонировать',
    })
  }
  customButtons.push(
    {
      key: 'edit',
      icon: faPencilAlt,
      onClick: () => onEdit?.(message),
      color: 'orange',
      tooltipText: 'Редактировать',
    },
    {
      key: 'delete',
      icon: faTrashAlt,
      onClick: () => {
        if (isDeleting) return
        onDelete?.(message)
      },
      color: 'red',
      tooltipText: isDeleting ? 'Удаление...' : 'Удалить',
      active: isDeleting,
      disabled: isDeleting,
    }
  )

  return (
    <CardWrapper
      onClick={() => onEdit?.(message)}
      className="flex items-center px-1"
      flex={false}
    >
      <div className="flex flex-col flex-1 gap-y-1">
        <div className="flex items-center justify-between gap-2">
          <TextLinesLimiter
            className="flex flex-1 font-bold text-general"
            textCenter={false}
            lines={2}
          >
            {message.name || 'Без названия'}
          </TextLinesLimiter>
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${statusClass}`}
          >
            {SCHEDULED_MESSAGE_STATUS_NAME[message.status] || '-'}
          </span>
          {isReadyWithPastDate && (
            <span className="text-xs font-bold text-red-600">
              Указана прошедшая дата
            </span>
          )}
        </div>
        {(shouldShowChannel || sendDateTime) && (
          <div className="flex flex-wrap items-center text-sm text-gray-600 gap-x-4 gap-y-1">
            <div className="flex-1">
              {shouldShowChannel && (
                <span>
                  Канал:{' '}
                  <span className="font-semibold text-black">
                    {getChannelName(message.channel)}
                  </span>
                </span>
              )}
            </div>
            <span className="text-sm">
              <span className="text-gray-600">Отправка: </span>
              <span className="text-black">{sendDateTime}</span>
            </span>
          </div>
        )}
        {preview && (
          <TextLinesLimiter
            lines={3}
            textCenter={false}
            textClassName="text-sm text-general"
          >
            {preview}
          </TextLinesLimiter>
        )}
      </div>
      <CardButtons
        item={message}
        customButtons={customButtons}
        customOnly
        alwaysCompact
      />
    </CardWrapper>
  )
}

export default ScheduledMessageCard
