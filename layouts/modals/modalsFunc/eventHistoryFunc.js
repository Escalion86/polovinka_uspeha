import EventTagsChipsLine from '@components/Chips/EventTagsChipsLine'
import DateTimeEvent from '@components/DateTimeEvent'
import UserNameById from '@components/UserNameById'
import {
  faAdd,
  faAngleDown,
  faRefresh,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import compareObjects from '@helpers/compareObjects'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import formatAddress from '@helpers/formatAddress'
import { historiesOfEventSelector } from '@state/atoms/historiesOfEventAtom'
import eventSelector from '@state/selectors/eventSelector'
import cn from 'classnames'
import { motion } from 'framer-motion'
import DOMPurify from 'isomorphic-dompurify'
import { useState } from 'react'
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

const HistoryItem = ({ action, changes, createdAt, userId }) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const [createdAtDate, createdAtTime] = dateToDateTimeStr(
    createdAt,
    true,
    false
  )

  const arrayOfChanges = []
  for (const [key, value] of Object.entries(changes)) {
    console.log('value :>> ', key, value)
    arrayOfChanges.push(
      (() => {
        return (
          <div
            className={cn(
              'flex flex-col gap-x-1',
              'border-gray-300  border-t-1'
            )}
          >
            {/* <div
              className="flex h-6 cursor-pointer"
              onClick={() => {
              setIsCollapsed((state) => !state)
            }}
            > */}
            <div className="flex-1 font-bold">{eventKeys[key]}</div>
            {/* <div
                className={cn('w-4 duration-300 transition-transform', {
                  'rotate-180': isCollapsed,
                })}
              >
                <FontAwesomeIcon icon={faAngleDown} size="lg" />
              </div>
            </div> */}
            <motion.div
              className="overflow-hidden"
              initial={{ height: 0 }}
              animate={{ height: isCollapsed ? 0 : 'auto' }}
            >
              <div className="flex mt-1 gap-x-1">
                <div className="w-12 italic font-bold border-r-2 tablet:w-14 tablet:min-w-14 text-danger min-w-12 border-danger">
                  Было
                </div>
                {key === 'description' ? (
                  <div
                    className="w-full max-w-full overflow-hidden list-disc textarea ql"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(value.old),
                    }}
                  />
                ) : key === 'tags' ? (
                  <EventTagsChipsLine tags={value.old} className="flex-1" />
                ) : key === 'address' ? (
                  formatAddress(value.old, '[не указан]')
                ) : key === 'usersRelationshipAccess' ? (
                  value.old === 'no' ? (
                    'Без пары'
                  ) : value.old === 'only' ? (
                    'Только с парой'
                  ) : (
                    'Всем'
                  )
                ) : key === 'price' ? (
                  value.old / 100 + ' ₽'
                ) : key === 'usersStatusAccess' ? (
                  <div>
                    <div>Не авторизован: {value.old?.noReg ? 'Да' : 'Нет'}</div>
                    <div>Новичок: {value.old?.novice ? 'Да' : 'Нет'}</div>
                    <div>
                      Участник клуба: {value.old?.member ? 'Да' : 'Нет'}
                    </div>
                  </div>
                ) : key === 'usersStatusDiscount' ? (
                  <div>
                    <div>Новичок: {(value.old?.novice ?? 0) / 100 + ' ₽'}</div>
                    <div>
                      Участник клуба: {(value.old?.member ?? 0) / 100 + ' ₽'}
                    </div>
                  </div>
                ) : [
                    'maxParticipants',
                    'maxMans',
                    'maxWomans',
                    'maxMansNovice',
                    'maxWomansNovice',
                    'maxMansMember',
                    'maxWomansMember',
                    'minMansAge',
                    'maxMansAge',
                    'minWomansAge',
                    'maxWomansAge',
                  ].includes(key) ? (
                  typeof value.old === 'number' ? (
                    value.old + ' чел.'
                  ) : (
                    'Без ограничений'
                  )
                ) : value.old !== null && typeof value.old === 'object' ? (
                  <pre>{JSON.stringify(value.old)}</pre>
                ) : typeof value.old === 'boolean' ? (
                  value.old ? (
                    'Да'
                  ) : (
                    'Нет'
                  )
                ) : (
                  value.old
                )}
              </div>
              <div className="flex pb-1 mt-1 gap-x-1">
                <div className="w-12 italic font-bold border-r-2 tablet:w-14 tablet:min-w-14 text-success min-w-12 border-success">
                  Стало
                </div>
                {key === 'description' ? (
                  <div
                    className="w-full max-w-full overflow-hidden list-disc textarea ql"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(value.new),
                    }}
                  />
                ) : key === 'tags' ? (
                  <EventTagsChipsLine
                    tags={value.new}
                    className="flex-1"
                    // noWrap
                  />
                ) : key === 'address' ? (
                  formatAddress(value.new, '[не указан]')
                ) : key === 'usersRelationshipAccess' ? (
                  value.new === 'no' ? (
                    'Только '
                  ) : value.new === 'only' ? (
                    'Только парам'
                  ) : (
                    'Всем'
                  )
                ) : key === 'price' ? (
                  value.new / 100 + ' ₽'
                ) : key === 'usersStatusAccess' ? (
                  <div>
                    <div>Не авторизован: {value.new?.noReg ? 'Да' : 'Нет'}</div>
                    <div>Новичок: {value.new?.novice ? 'Да' : 'Нет'}</div>
                    <div>
                      Участник клуба: {value.new?.member ? 'Да' : 'Нет'}
                    </div>
                  </div>
                ) : key === 'usersStatusDiscount' ? (
                  <div>
                    <div>Новичок: {value.new?.novice / 100 + ' ₽'}</div>
                    <div>Участник клуба: {value.new?.member / 100 + ' ₽'}</div>
                  </div>
                ) : [
                    'maxParticipants',
                    'maxMans',
                    'maxWomans',
                    'maxMansNovice',
                    'maxWomansNovice',
                    'maxMansMember',
                    'maxWomansMember',
                    'minMansAge',
                    'maxMansAge',
                    'minWomansAge',
                    'maxWomansAge',
                  ].includes(key) ? (
                  typeof value.new === 'number' ? (
                    value.new + ' чел.'
                  ) : (
                    'Не ограничено'
                  )
                ) : value.new !== null && typeof value.new === 'object' ? (
                  <pre>{JSON.stringify(value.new)}</pre>
                ) : typeof value.new === 'boolean' ? (
                  value.new ? (
                    'Да'
                  ) : (
                    'Нет'
                  )
                ) : (
                  value.new
                )}
              </div>
            </motion.div>
          </div>
        )
      })()
    )
  }

  return (
    <div
      className="px-1 border border-gray-500 rounded-lg cursor-pointer hover:bg-gray-100"
      onClick={() => {
        setIsCollapsed((state) => !state)
      }}
    >
      <div className="flex items-center py-1 gap-x-2">
        <FontAwesomeIcon
          className="w-5 h-5"
          icon={
            action === 'add' ? faAdd : action === 'delete' ? faTimes : faRefresh
          }
          color={
            action === 'add' ? 'green' : action === 'delete' ? 'red' : 'blue'
          }
        />
        <div className="flex flex-col flex-1 gap-y-0.5 gap-x-2 tablet:items-center tablet:flex-row">
          <div className="flex items-center gap-x-2">
            <div className="flex text-sm flex-nowrap tablet:text-base gap-x-1">
              <span className="whitespace-nowrap">{createdAtDate}</span>
              <span className="font-bold">{createdAtTime}</span>
            </div>
          </div>
          <UserNameById
            userId={userId}
            className="flex-1 font-semibold text-general"
            thin
            trunc={1}
          />
        </div>
        {(action === 'update' || action === 'updete') && (
          <div
            className={cn(
              'w-4 duration-300 transition-transform flex items-center justify-center',
              {
                'rotate-180': isCollapsed,
              }
            )}
          >
            <FontAwesomeIcon icon={faAngleDown} size="lg" />
          </div>
        )}
        {/* <div
              className="flex h-6 cursor-pointer"
              onClick={() => {
              setIsCollapsed((state) => !state)
            }}
            > */}
        {/* <div className="flex-1 font-bold">{eventKeys[key]}</div> */}
        {/* <div
                className={cn('w-4 duration-300 transition-transform', {
                  'rotate-180': isCollapsed,
                })}
              >
                <FontAwesomeIcon icon={faAngleDown} size="lg" />
              </div>
            </div> */}
      </div>
      {(action === 'update' || action === 'updete') && (
        <div>{arrayOfChanges}</div>
      )}
    </div>
  )
}

const compareObjectsWithDif = (oldObj, newObj) => {
  const dif = {}
  for (const [key, value] of Object.entries(newObj)) {
    if (key !== 'updatedAt')
      if (!(key in oldObj)) dif[key] = { old: undefined, new: value }
      else if (oldObj[key] !== null && typeof oldObj[key] === 'object') {
        if (!compareObjects(oldObj[key], newObj[key])) {
          dif[key] = { old: oldObj[key], new: newObj[key] }
        }
      } else if (oldObj[key] !== newObj[key]) {
        dif[key] = { old: oldObj[key], new: newObj[key] }
      }
  }
  return dif
}

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
          {eventHistory.map(({ action, data, userId, createdAt }, index) => {
            const changes = compareObjectsWithDif(
              index > 0 ? eventHistory[index - 1].data[0] : {},
              data[0]
            )

            // console.log('changes :>> ', changes)

            return (
              <HistoryItem
                action={action}
                changes={changes}
                createdAt={createdAt}
                userId={userId}
              />
            )
          })}
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
