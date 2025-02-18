import Button from '@components/Button'
import eventPriceByStatus from '@helpers/eventPriceByStatus'
import isUserQuestionnaireFilledFunc from '@helpers/isUserQuestionnaireFilled'
import modalsFuncAtom from '@state/modalsFuncAtom'
import loggedUserToEventStatusSelector from '@state/selectors/loggedUserToEventStatusSelector'
import sumOfPaymentsFromLoggedUserToEventSelector from '@state/selectors/sumOfPaymentsFromLoggedUserToEventSelector'
import cn from 'classnames'
import { Suspense } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useAtomValue } from 'jotai'
import EventProfit from './EventProfit'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import eventSelector from '@state/selectors/eventSelector'
import eventLoggedUserByEventIdSelector from '@state/selectors/eventLoggedUserByEventIdSelector'

const TextStatus = ({ children, className }) => (
  <div
    className={cn(
      'flex justify-center items-center text-base laptop:text-lg font-bold uppercase px-1 whitespace-nowrap',
      className
    )}
  >
    {children}
  </div>
)

const PaymentsFromLoggedUser = ({ eventId, noBorders }) => {
  const event = useAtomValue(eventSelector(eventId))
  const eventStatus = useAtomValue(loggedUserToEventStatusSelector(eventId))

  const { userStatus, userEventStatus } = eventStatus

  const sumOfPaymentsFromLoggedUserToEvent = useAtomValue(
    sumOfPaymentsFromLoggedUserToEventSelector(event._id)
  )

  const eventUser = useAtomValue(eventLoggedUserByEventIdSelector(event._id))
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  if (
    !eventUser ||
    !loggedUserActive ||
    !userEventStatus ||
    userEventStatus !== 'participant'
  )
    return null

  const subEvent = event.subEvents.find(({ id }) => id === eventUser.subEventId)
  // TODO СДЕЛАТЬ ПРОВЕРКУ НА ТО ЧТО ВАРИАНТ УЧАСТИЯ СУЩЕСТВУЕТ, иначе вылетает ошибка
  const eventPriceForLoggedUser = eventPriceByStatus(subEvent, userStatus)

  if (eventPriceForLoggedUser === 0) return null

  return (
    <div
      className={cn(
        'flex items-center justify-center min-h-9',
        noBorders ? '' : 'border-r border-gray-200'
      )}
    >
      {sumOfPaymentsFromLoggedUserToEvent * 100 >= eventPriceForLoggedUser ? (
        <div className="flex items-center justify-center px-1 font-bold laptop:text-lg text-success gap-x-1">
          <span className="leading-4">ОПЛАЧЕНО</span>
        </div>
      ) : sumOfPaymentsFromLoggedUserToEvent > 0 &&
        sumOfPaymentsFromLoggedUserToEvent * 100 < eventPriceForLoggedUser ? (
        <div className="flex flex-wrap items-center justify-center px-1 font-bold text-orange-700 laptop:text-lg gap-x-1">
          <span className="leading-4">ЗАДАТОК</span>
          <span className="leading-4">{`${sumOfPaymentsFromLoggedUserToEvent} ₽`}</span>
        </div>
      ) : userEventStatus && event.status !== 'canceled' ? (
        <div className="flex items-center justify-center px-1 font-bold text-center laptop:text-lg text-danger gap-x-1">
          <span className="leading-4">НЕ ОПЛАЧЕНО</span>
        </div>
      ) : null}
    </div>
  )
}

const Status = ({
  eventId,
  thin,
  classNameProfit,
  noButtonIfAlreadySignIn,
  className,
}) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const event = useAtomValue(eventSelector(eventId))
  const eventStatus = useAtomValue(loggedUserToEventStatusSelector(eventId))
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)

  const showProfitOnCard = loggedUserActiveRole?.events?.showProfitOnCard

  const eventUser = useAtomValue(eventLoggedUserByEventIdSelector(event._id))

  const isUserQuestionnaireFilled =
    isUserQuestionnaireFilledFunc(loggedUserActive)

  const {
    canSee,
    alreadySignIn,
    canSignIn,
    canSignInReserve,
    canSignOut,
    isEventExpired,
    isEventInProcess,
    userEventStatus,
    isUserRelationshipCorrect,
  } = eventStatus

  return showProfitOnCard && event.status === 'closed' ? (
    <EventProfit eventId={event._id} className={classNameProfit} />
  ) : event.status === 'canceled' ? (
    <TextStatus className="text-danger">Отменено</TextStatus>
  ) : event.likes &&
    eventUser &&
    userEventStatus === 'participant' &&
    !loggedUserActive.relationship &&
    (isEventInProcess || isEventExpired) &&
    // event.status !== 'closed' &&
    alreadySignIn ? (
    <Button
      thin={thin}
      stopPropagation
      classBgColor="bg-pink-500"
      className={cn('border w-auto self-center', className)}
      name={
        event.likesProcessActive
          ? eventUser?.likes === null
            ? 'Поставить'
            : `Поставлено ${eventUser?.likes.length || 0}`
          : 'Совпадения'
      }
      onClick={() =>
        event.likesProcessActive
          ? modalsFunc.eventUser.editLike({
              eventId: event._id,
              userId: loggedUserActive._id,
            })
          : modalsFunc.eventUser.likesResult({
              eventId: event._id,
              userId: loggedUserActive._id,
            })
      }
      icon={faHeart}
      iconRight
    />
  ) : isEventExpired ? (
    <TextStatus className="text-success">Завершено</TextStatus>
  ) : userEventStatus === 'assistant' ? (
    <TextStatus className="text-general">Ведущий</TextStatus>
  ) : (noButtonIfAlreadySignIn &&
      canSignOut &&
      (!isEventInProcess || !event.likes)) ||
    (isEventInProcess && canSignOut && !event.likes) ? (
    <TextStatus className="text-blue-600">
      {userEventStatus === 'reserve' ? 'В резерве' : 'Записан'}
    </TextStatus>
  ) : !event.showOnSite ? (
    <TextStatus className="text-purple-500">Скрыто</TextStatus>
  ) : !canSee ? (
    <TextStatus className="text-danger">Не доступно</TextStatus>
  ) : isUserQuestionnaireFilled &&
    !canSignIn &&
    !canSignOut &&
    !canSignInReserve ? (
    <TextStatus className="text-danger">
      {isUserRelationshipCorrect
        ? 'Мест нет'
        : event.usersRelationshipAccess === 'only'
          ? 'Для пар'
          : 'Для одиноких'}
    </TextStatus>
  ) : isEventInProcess && (noButtonIfAlreadySignIn || !canSignIn) ? (
    <TextStatus className="text-general">В процессе</TextStatus>
  ) : (
    <Button
      thin={thin}
      stopPropagation
      onClick={() => {
        if (!loggedUserActive || (canSignIn && !alreadySignIn)) {
          modalsFunc.event.signUp(event)
        } else if (loggedUserActive.status === 'ban') {
          modalsFunc.event.cantSignUp()
        } else if (
          (!canSignIn && !alreadySignIn && canSignInReserve) ||
          !isUserQuestionnaireFilled
        ) {
          modalsFunc.event.signUp(event, 'reserve')
        } else if (canSignOut) {
          modalsFunc.event.signOut(event, userEventStatus)
        }
      }}
      classBgColor={canSignOut ? 'bg-danger' : undefined}
      className={cn('border w-auto self-center', className)}
      name={
        canSignOut
          ? `Отменить запись${userEventStatus === 'reserve' ? ' в резерв' : ''}`
          : canSignIn || !loggedUserActive
            ? 'Записаться'
            : isUserQuestionnaireFilled
              ? canSignInReserve
                ? 'Записаться в резерв'
                : 'Мест нет'
              : 'Записаться' // 'Заполните свой профиль'
      }
    />
  )
}

const EventButtonSignIn = ({
  eventId,
  className,
  noButtonIfAlreadySignIn,
  thin,
  classNameProfit,
  noBorders,
}) => (
  <div className={cn('flex', className)}>
    <Suspense
      fallback={
        <Skeleton
          className="h-[18px] w-[110px] mr-1"
          containerClassName="flex items-center"
        />
      }
    >
      <PaymentsFromLoggedUser eventId={eventId} noBorders={noBorders} />
    </Suspense>
    <Suspense fallback={<Skeleton className="h-[80%] w-[100px] mr-1" />}>
      <div className="flex items-center pl-1">
        <Status
          eventId={eventId}
          thin={thin}
          classNameProfit={classNameProfit}
          noButtonIfAlreadySignIn={noButtonIfAlreadySignIn}
          className={className}
        />
      </div>
    </Suspense>
  </div>
)

export default EventButtonSignIn
