import EventTagsChipsLine from '@components/Chips/EventTagsChipsLine'
import DateTimeEvent from '@components/DateTimeEvent'
import HistoryItem from '@components/HistoryItem'
import InputImages from '@components/InputImages'
import UserNameById from '@components/UserNameById'
import compareObjectsWithDif from '@helpers/compareObjectsWithDif'
import { EVENT_STATUSES } from '@helpers/constants'
import formatAddress from '@helpers/formatAddress'
import formatDateTime from '@helpers/formatDateTime'
import textAge from '@helpers/textAge'
import { historiesOfEventSelector } from '@state/atoms/historiesOfEventAtom'
import eventSelector from '@state/selectors/eventSelector'
import DOMPurify from 'isomorphic-dompurify'
import { useRecoilValue } from 'recoil'

const eventKeys = {
  directionId: 'Направление',
  title: 'Заголовок',
  description: 'Описание',
  dateStart: 'Дата и время начала',
  dateEnd: 'Дата и время завершения',
  address: 'Адрес',
  status: 'Статус',
  images: 'Картинки',
  tags: 'Тэги',
  organizerId: 'Организатор',
  price: 'Стоимость',
  maxParticipants: 'Максимум участников',
  maxMans: 'Максимум мужчин',
  maxWomans: 'Максимум женщин',
  maxMansNovice: 'Максимум мужчин новичков',
  maxWomansNovice: 'Максимум женщин новичков',
  maxMansMember: 'Максимум мужчин клубных',
  maxWomansMember: 'Максиум женщин клубных',
  minMansAge: 'Минимальный возраст мужчин',
  maxMansAge: 'Максимальный возраст мужчин',
  minWomansAge: 'Минимальный возраст женщин',
  maxWomansAge: 'Максимальный возраст женщин',
  usersStatusAccess: 'Доступ по статусу',
  usersStatusDiscount: 'Скидки',
  usersRelationshipAccess: 'Доступ по отношениям',
  isReserveActive: 'Активность резерва',
  showOnSite: 'Показывать на сайте',
  report: 'Отчет',
  reportImages: 'Картинки в отчете',
  warning: 'Предупреждение об опасности',
  googleCalendarId: 'Google Calendar ID',
}

// 'dateStart' || key === 'dateEnd' ? (
//   formatDateTime(value.old)
// ),

const KeyValueItem = ({ objKey, value }) =>
  value === undefined ? (
    '[не указано]'
  ) : objKey === 'description' ? (
    <div
      className="w-full max-w-full overflow-hidden list-disc textarea ql"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(value),
      }}
    />
  ) : objKey === 'tags' ? (
    <EventTagsChipsLine tags={value} className="flex-1" />
  ) : objKey === 'organizerId' ? (
    <UserNameById userId={value} thin trunc={1} />
  ) : objKey === 'dateStart' || objKey === 'dateEnd' ? (
    formatDateTime(value)
  ) : objKey === 'status' ? (
    EVENT_STATUSES.find((item) => item.value === value)?.name
  ) : objKey === 'images' ? (
    <InputImages images={value} readOnly />
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

const eventHistoryFunc = (eventId) => {
  const EventHistoryModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const event = useRecoilValue(eventSelector(eventId))
    const eventHistory = useRecoilValue(historiesOfEventSelector(eventId))

    if (!event || !eventId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Мероприятие не найдено!
        </div>
      )

    return (
      <div className="flex flex-col items-center flex-1 gap-y-2">
        <div className="text-lg font-bold">{event.title}</div>
        <DateTimeEvent
          wrapperClassName="text-base laptop:text-lg font-bold leading-4 laptop:leading-5 justify-center laptop:justify-start"
          dateClassName="text-general"
          timeClassName="italic"
          durationClassName="italic text-base font-normal"
          event={event}
          showDayOfWeek
          fullMonth
        />
        <div className="flex flex-col w-full gap-y-1">
          {eventHistory.map(
            ({ action, data, userId, createdAt, _id }, index) => {
              const changes = compareObjectsWithDif(
                index > 0 ? eventHistory[index - 1].data[0] : {},
                data[0]
              )

              // console.log('changes :>> ', changes)

              return (
                <HistoryItem
                  key={_id}
                  action={action}
                  changes={changes}
                  createdAt={createdAt}
                  userId={userId}
                  keys={eventKeys}
                  KeyValueItem={KeyValueItem}
                />
              )
            }
          )}
        </div>
      </div>
    )
  }

  return {
    title: `История изменений мероприятия`,
    Children: EventHistoryModal,
    declineButtonName: 'Закрыть',
    showDecline: true,
  }
}

export default eventHistoryFunc
