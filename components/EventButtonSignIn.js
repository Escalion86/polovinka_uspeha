import Button from '@components/Button'
import eventPriceByStatus from '@helpers/eventPriceByStatus'
import isUserQuestionnaireFilledFunc from '@helpers/isUserQuestionnaireFilled'
import { modalsFuncAtom } from '@state/atoms'
import eventAtom from '@state/async/eventAtom'
import loggedUserToEventStatusSelector from '@state/selectors/loggedUserToEventStatusSelector'
import sumOfPaymentsFromLoggedUserToEventSelector from '@state/selectors/sumOfPaymentsFromLoggedUserToEventSelector'
import cn from 'classnames'
import { Suspense } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useRecoilValue } from 'recoil'
import EventProfit from './EventProfit'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'

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

const EventButtonSignInComponent = ({
  eventId,
  className,
  noButtonIfAlreadySignIn,
  thin,
  classNameProfit,
  noBorders,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const event = useRecoilValue(eventAtom(eventId))
  const loggedUserActive = useRecoilValue(loggedUserActiveAtom)
  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
  const sumOfPaymentsFromLoggedUserToEvent = useRecoilValue(
    sumOfPaymentsFromLoggedUserToEventSelector(eventId)
  )

  const showProfitOnCard = loggedUserActiveRole?.events?.showProfitOnCard

  const eventStatus = useRecoilValue(loggedUserToEventStatusSelector(eventId))
  const {
    canSee,
    alreadySignIn,
    canSignIn,
    canSignInReserve,
    canSignOut,
    isEventExpired,
    isEventInProcess,
    userStatus,
    userEventStatus,
    status,
    isUserRelationshipCorrect,
  } = eventStatus

  const isUserQuestionnaireFilled =
    isUserQuestionnaireFilledFunc(loggedUserActive)

  const PaymentsFromLoggedUser = () => {
    if (
      !loggedUserActive ||
      !userEventStatus ||
      userEventStatus !== 'participant'
    )
      return null

    const eventUsers = useRecoilValue(eventsUsersFullByEventIdSelector(eventId))
    const eventUser = eventUsers.find(
      ({ userId }) => userId === loggedUserActive?._id
    )
    if (!eventUser) return null

    const subEvent = event.subEvents.find(
      ({ id }) => id === eventUser.subEventId
    )
    const eventPriceForLoggedUser = eventPriceByStatus(subEvent, userStatus)

    if (eventPriceForLoggedUser === 0) return null

    if (sumOfPaymentsFromLoggedUserToEvent * 100 === eventPriceForLoggedUser)
      return (
        <div
          className={cn(
            'flex items-center justify-center min-h-9',
            noBorders ? '' : 'border-r border-gray-200'
          )}
        >
          <div className="flex items-center justify-center px-1 font-bold laptop:text-lg text-success gap-x-1">
            <span className="leading-4">ОПЛАЧЕНО</span>
          </div>
        </div>
      )
    if (
      sumOfPaymentsFromLoggedUserToEvent > 0 &&
      sumOfPaymentsFromLoggedUserToEvent * 100 < eventPriceForLoggedUser
    )
      return (
        <div
          className={cn(
            'flex items-center justify-center min-h-9',
            noBorders ? '' : 'border-r border-gray-200'
          )}
        >
          <div className="flex flex-wrap items-center justify-center px-1 font-bold text-orange-600 laptop:text-lg gap-x-1">
            <span className="leading-4">ЗАДАТОК</span>
            <span className="leading-4">{`${sumOfPaymentsFromLoggedUserToEvent} ₽`}</span>
          </div>
        </div>
      )
    if (userEventStatus && event.status !== 'canceled')
      return (
        <div
          className={cn(
            'flex items-center justify-center min-h-9',
            noBorders ? '' : 'border-r border-gray-200'
          )}
        >
          <div className="flex items-center justify-center px-1 font-bold text-center laptop:text-lg text-danger gap-x-1">
            <span className="leading-4">НЕ ОПЛАЧЕНО</span>
          </div>
        </div>
        // <Button
        //   thin={thin}
        //   stopPropagation
        //   name="Оплатить"
        //   onClick={() => {}}
        // />
      )
    return null
  }

  const Status = () =>
    showProfitOnCard && event.status === 'closed' ? (
      <EventProfit eventId={event._id} className={classNameProfit} />
    ) : event.status === 'canceled' ? (
      <TextStatus className="text-danger">Отменено</TextStatus>
    ) : event.likes &&
      userEventStatus === 'participant' &&
      !loggedUserActive.relationship &&
      (isEventInProcess || isEventExpired) &&
      event.status !== 'closed' &&
      alreadySignIn ? (
      <Button
        thin={thin}
        stopPropagation
        classBgColor="bg-pink-500"
        className={cn('border w-auto self-center', className)}
        name={event.likesProcessActive ? 'Поставить' : 'Совпадения'}
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
    ) : (noButtonIfAlreadySignIn && canSignOut && !event.likes) ||
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
            ? `Отменить запись${
                userEventStatus === 'reserve' ? ' в резерв' : ''
              }`
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

  return (
    <div className={cn('flex', className)}>
      <PaymentsFromLoggedUser />
      <div className="flex items-center h-full pl-1">
        <Status />
      </div>
    </div>
  )
}

const EventButtonSignIn = (props) => (
  <Suspense fallback={<Skeleton className="h-[80%] w-[100px] mr-1" />}>
    <EventButtonSignInComponent {...props} />
  </Suspense>
)

export default EventButtonSignIn
