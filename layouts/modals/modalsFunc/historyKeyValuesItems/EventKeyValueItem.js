import EventTagsChipsLine from '@components/Chips/EventTagsChipsLine'
import DirectionTitleById from '@components/DirectionTitleById'
import InputImages from '@components/InputImages'
import UserNameById from '@components/UserNameById'
import { EVENT_STATUSES } from '@helpers/constants'
import formatAddress from '@helpers/formatAddress'
import formatDateTime from '@helpers/formatDateTime'
import textAge from '@helpers/textAge'
import DOMPurify from 'isomorphic-dompurify'

const EventKeyValueItem = ({ objKey, value }) =>
  value === undefined ? (
    '[не указано]'
  ) : objKey === 'description' ? (
    <div
      className="w-full max-w-full overflow-hidden list-disc textarea ql"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(value),
      }}
    />
  ) : objKey === 'directionId' ? (
    <DirectionTitleById directionId={value} className="flex-1" />
  ) : objKey === 'tags' ? (
    <EventTagsChipsLine tags={value} className="flex-1" />
  ) : objKey === 'organizerId' ? (
    <UserNameById userId={value} thin trunc={1} />
  ) : objKey === 'dateStart' || objKey === 'dateEnd' ? (
    formatDateTime(value)
  ) : objKey === 'status' ? (
    EVENT_STATUSES.find((item) => item.value === value)?.name
  ) : objKey === 'images' ? (
    <InputImages
      images={value}
      readOnly
      noMargin
      paddingY={false}
      paddingX={false}
    />
  ) : objKey === 'address' ? (
    formatAddress(value, '[не указан]')
  ) : objKey === 'usersRelationshipAccess' ? (
    value === 'no' ? (
      'Без пары'
    ) : value === 'only' ? (
      'Только с парой'
    ) : (
      'Всем'
    )
  ) : objKey === 'price' ? (
    value / 100 + ' ₽'
  ) : objKey === 'usersStatusAccess' ? (
    <div>
      <div>Не авторизован: {value?.noReg ? 'Да' : 'Нет'}</div>
      <div>Новичок: {value?.novice ? 'Да' : 'Нет'}</div>
      <div>Участник клуба: {value?.member ? 'Да' : 'Нет'}</div>
    </div>
  ) : objKey === 'usersStatusDiscount' ? (
    <div>
      <div>Новичок: {(value?.novice ?? 0) / 100 + ' ₽'}</div>
      <div>Участник клуба: {(value?.member ?? 0) / 100 + ' ₽'}</div>
    </div>
  ) : [
      'maxParticipants',
      'maxMans',
      'maxWomans',
      'maxMansNovice',
      'maxWomansNovice',
      'maxMansMember',
      'maxWomansMember',
    ].includes(objKey) ? (
    typeof value === 'number' ? (
      value + ' чел.'
    ) : (
      'Без ограничений'
    )
  ) : ['minMansAge', 'maxMansAge', 'minWomansAge', 'maxWomansAge'].includes(
      objKey
    ) ? (
    typeof value === 'number' ? (
      `${value} ${textAge(value)}`
    ) : (
      'Не задан'
    )
  ) : value !== null && typeof value === 'object' ? (
    <pre>{JSON.stringify(value)}</pre>
  ) : typeof value === 'boolean' ? (
    value ? (
      'Да'
    ) : (
      'Нет'
    )
  ) : (
    value
  )

export default EventKeyValueItem
