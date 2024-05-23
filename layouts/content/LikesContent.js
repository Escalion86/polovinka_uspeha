'use client'

import { modalsFuncAtom } from '@state/atoms'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { useRecoilValue } from 'recoil'
import { EventItem } from '@components/ItemCards'
import eventsLoggedUserWithLikesSelector from '@state/selectors/eventsLoggedUserWithLikesSelector'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart'
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import cn from 'classnames'
import Note from '@components/Note'

const EventLikesItem = ({ eventWithEventUsers, className }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const loggedUserActive = useRecoilValue(loggedUserActiveAtom)
  const { eventUsers } = eventWithEventUsers
  const eventLoggedUser = eventUsers.find(
    ({ userId }) => userId === loggedUserActive?._id
  )
  const loggedUserLikes = eventLoggedUser?.likes

  const coincidenceCount = eventWithEventUsers.likesProcessActive
    ? null
    : !loggedUserLikes || loggedUserLikes?.length === 0
      ? 0
      : eventUsers.reduce((sum, { likes, userId }) => {
          if (!likes || likes?.length === 0 || loggedUserActive?._id === userId)
            return sum
          if (
            likes.includes(loggedUserActive?._id) &&
            loggedUserLikes.includes(userId)
          )
            return sum + 1
          return sum
        }, 0)

  return (
    <div
      className={cn(
        'flex cursor-pointer hover:shadow-medium-active bg-gray-100',
        className
      )}
      onClick={
        () =>
          modalsFunc.eventUser.likesResult({
            eventId: eventWithEventUsers._id,
            userId: loggedUserActive._id,
          })
        // modalsFunc.event.view(eventWithEventUsers._id)
      }
    >
      <EventItem
        item={eventWithEventUsers}
        bordered={false}
        noBorder
        classNameHeight="h-[36px] tablet:h-10"
        noStatusIcon
      />
      {coincidenceCount !== null && !eventLoggedUser.seeLikesResult ? (
        <div className="relative leading-3 text-center h-[36px] w-24 text-[#EC4899] tablet:text-lg font-bold tablet:leading-4 tablet:w-32 tablet:h-10 flex items-center justify-center px-1 border-l border-gray-700">
          Посмотреть результат
        </div>
      ) : coincidenceCount === null && !loggedUserLikes ? (
        <div className="relative leading-3 text-center h-[36px] w-24 text-[#EC4899] tablet:text-lg font-bold tablet:leading-4 tablet:w-32 tablet:h-10 flex items-center justify-center px-1 border-l border-gray-700">
          Поставить лайки
        </div>
      ) : (
        <div className="relative h-[36px] w-[36px] tablet:w-10 tablet:h-10 flex items-center justify-center px-1 border-l border-gray-700">
          <FontAwesomeIcon
            className="w-7 h-7 tablet:w-8 tablet:h-8"
            icon={faHeart}
            color={
              coincidenceCount === null
                ? '#7a5151'
                : coincidenceCount > 0
                  ? '#EC4899'
                  : '#9ca3af'
            }
          />
          {coincidenceCount > 0 && eventLoggedUser.seeLikesResult && (
            <FontAwesomeIcon
              className="absolute left-1 top-1 w-7 h-7 tablet:w-8 tablet:h-8 animate-ping"
              icon={faHeart}
              color="#EC4899"
            />
          )}
          <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center text-white">
            {coincidenceCount === null
              ? loggedUserLikes?.length
              : coincidenceCount}
          </div>
        </div>
      )}
    </div>
  )
}

const LikesContent = () => {
  const eventsWithLikes = useRecoilValue(eventsLoggedUserWithLikesSelector)

  const eventsWithWaitingLikes = eventsWithLikes.filter(
    ({ likesProcessActive }) => likesProcessActive
  )
  const eventsWithSettedLikes = eventsWithLikes.filter(
    ({ likesProcessActive }) => !likesProcessActive
  )

  return (
    <div className="flex flex-col m-1">
      <Note>
        <b>Что такое лайки?</b> Лайки - это символ симпатии в виде сердечка.
        <br />
        Посещая мероприятия, на некоторых из них, вы можете выставять друг другу
        лайки (симпатии). <br />
        Если вдруг Вы поставите лайк тому, кто тоже поставит Вам лайк, то вы
        сможете посмотреть анкеты друг друга и увидеть контакты для связи!
      </Note>
      {!eventsWithWaitingLikes?.length && !eventsWithSettedLikes?.length && (
        <div>
          Вы не посетили ни одного мероприятия, где можно выставлять лайки
        </div>
      )}
      {eventsWithWaitingLikes?.length > 0 && (
        <>
          <div className="w-full text-lg font-bold text-center">
            Мероприятия ожидающие лайков
          </div>
          <Note>
            Список мероприятий в которых еще идет процесс выставления лайков.
            <br />
            Если вы не сделали свой выбор, то сделайте это сейчас!
            <br />
            Пока прием лайков не закрыт вы можете отредактировать свой выбор
          </Note>
          <div className="flex flex-col items-stretch w-full overflow-hidden border border-gray-700 rounded">
            {eventsWithWaitingLikes.map((eventWithEventUsers, index) => (
              <EventLikesItem
                key={eventWithEventUsers._id}
                eventWithEventUsers={eventWithEventUsers}
                className={index > 0 ? 'border-t border-gray-700' : ''}
              />
            ))}
          </div>
        </>
      )}
      {eventsWithSettedLikes?.length > 0 && (
        <>
          <div className="w-full mt-5 text-lg font-bold text-center">
            Мероприятия с результатами лайков
          </div>
          <Note>
            Список мероприятий в которых лайки выставлены.
            <br />
            Для просмотра результата кликните по мероприятию
          </Note>
          <div className="flex flex-col items-stretch w-full overflow-hidden border border-gray-700 rounded">
            {eventsWithSettedLikes.map((eventWithEventUsers, index) => (
              <EventLikesItem
                key={eventWithEventUsers._id}
                eventWithEventUsers={eventWithEventUsers}
                className={index > 0 ? 'border-t border-gray-700' : ''}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default LikesContent
