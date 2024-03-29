import Button from '@components/Button'
import isUserQuestionnaireFilledFunc from '@helpers/isUserQuestionnaireFilled'
import { modalsFuncAtom } from '@state/atoms'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import eventAtom from '@state/async/eventAtom'
import loggedUserToEventStatusSelector from '@state/selectors/loggedUserToEventStatusSelector'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'

const EventButtonSignIn = ({
  eventId,
  className,
  noButtonIfAlreadySignIn,
  thin,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const event = useRecoilValue(eventAtom(eventId))
  const loggedUserActive = useRecoilValue(loggedUserActiveAtom)

  const router = useRouter()

  const eventLoggedUserStatus = useRecoilValue(
    loggedUserToEventStatusSelector(eventId)
  )

  const isUserQuestionnaireFilled =
    isUserQuestionnaireFilledFunc(loggedUserActive)

  return event.status === 'canceled' ? (
    <div
      className={cn(
        'text-base tablet:text-lg font-bold uppercase text-danger',
        className
      )}
    >
      Отменено
    </div>
  ) : eventLoggedUserStatus.isEventExpired ? (
    <div
      className={cn(
        'text-base tablet:text-lg font-bold uppercase text-success',
        className
      )}
    >
      Завершено
    </div>
  ) : eventLoggedUserStatus.userEventStatus === 'assistant' ? (
    <div
      className={cn(
        'text-base tablet:text-lg font-bold uppercase text-general',
        className
      )}
    >
      Ведущий
    </div>
  ) : (noButtonIfAlreadySignIn && eventLoggedUserStatus.canSignOut) ||
    (eventLoggedUserStatus.isEventInProcess &&
      eventLoggedUserStatus.canSignOut) ? (
    <div
      className={cn(
        'text-base tablet:text-lg font-bold uppercase text-blue-600',
        className
      )}
    >
      {eventLoggedUserStatus.userEventStatus === 'reserve'
        ? 'В резерве'
        : 'Записан'}
    </div>
  ) : eventLoggedUserStatus.isEventInProcess &&
    (noButtonIfAlreadySignIn || !eventLoggedUserStatus.canSignIn) ? (
    <div
      className={cn(
        'text-base tablet:text-lg font-bold uppercase text-general',
        className
      )}
    >
      В процессе
    </div>
  ) : (
    <Button
      thin={thin}
      stopPropagation
      onClick={() => {
        if (loggedUserActive.status === 'ban') {
          modalsFunc.event.cantSignUp()
        } else if (
          !loggedUserActive ||
          (eventLoggedUserStatus.canSignIn &&
            !eventLoggedUserStatus.alreadySignIn)
        ) {
          modalsFunc.event.signUp(event)
        } else if (
          !eventLoggedUserStatus.canSignIn &&
          !eventLoggedUserStatus.alreadySignIn &&
          eventLoggedUserStatus.canSignInReserve
        ) {
          modalsFunc.event.signUp(event, 'reserve')
        } else if (!isUserQuestionnaireFilled) {
          closeModal()
          router.push('/cabinet/questionnaire', '', { shallow: true })
        } else if (eventLoggedUserStatus.canSignOut) {
          modalsFunc.event.signOut(event, eventLoggedUserStatus.userEventStatus)
        }
      }}
      classBgColor={eventLoggedUserStatus.canSignOut ? 'bg-danger' : undefined}
      className={cn('border w-auto', className)}
      name={
        eventLoggedUserStatus.canSignOut
          ? `Отменить запись${
              eventLoggedUserStatus.userEventStatus === 'reserve'
                ? ' в резерв'
                : ''
            }`
          : eventLoggedUserStatus.canSignIn || !loggedUserActive
            ? 'Записаться'
            : isUserQuestionnaireFilled
              ? eventLoggedUserStatus.canSignInReserve
                ? 'Записаться в резерв'
                : 'Мест нет'
              : 'Заполните свой профиль'
      }
      disabled={
        !eventLoggedUserStatus.canSignOut &&
        !eventLoggedUserStatus.canSignIn &&
        !eventLoggedUserStatus.canSignInReserve &&
        isUserQuestionnaireFilled
      }
    />
  )
}

export default EventButtonSignIn
