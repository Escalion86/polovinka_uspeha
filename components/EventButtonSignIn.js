import React from 'react'
import { useRecoilValue } from 'recoil'

import { modalsFuncAtom } from '@state/atoms'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import loggedUserToEventStatusSelector from '@state/selectors/loggedUserToEventStatusSelector'
import isUserQuestionnaireFilledFunc from '@helpers/isUserQuestionnaireFilled'
import eventSelector from '@state/selectors/eventSelector'
import { useRouter } from 'next/router'

import Button from '@components/Button'
import cn from 'classnames'

const EventButtonSignIn = ({
  eventId,
  className,
  noButtonIfAlreadySignIn,
  thin,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const event = useRecoilValue(eventSelector(eventId))
  const loggedUser = useRecoilValue(loggedUserAtom)

  const router = useRouter()

  const eventLoggedUserStatus = useRecoilValue(
    loggedUserToEventStatusSelector(eventId)
  )

  const isUserQuestionnaireFilled = isUserQuestionnaireFilledFunc(loggedUser)

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
        if (loggedUser.status === 'ban') {
          modalsFunc.event.cantSignUp()
        } else if (
          !loggedUser ||
          (eventLoggedUserStatus.canSignIn &&
            !eventLoggedUserStatus.alreadySignIn)
        ) {
          modalsFunc.event.signUp(event._id)
        } else if (
          !eventLoggedUserStatus.canSignIn &&
          !eventLoggedUserStatus.alreadySignIn &&
          eventLoggedUserStatus.canSignInReserve
        ) {
          modalsFunc.event.signUp(event._id, 'reserve')
        } else if (!isUserQuestionnaireFilled) {
          closeModal()
          router.push('/cabinet/questionnaire', '', { shallow: true })
        } else if (eventLoggedUserStatus.canSignOut) {
          modalsFunc.event.signOut(
            event._id,
            eventLoggedUserStatus.userEventStatus
          )
        }
      }}
      // className={cn(
      //   'px-4 py-1 text-white duration-300 border-t border-l rounded-tl-lg hover:bg-white',
      //   eventUser
      //    ? 'bg-success hover:text-success border-success'
      //     : 'bg-general hover:text-general border-general'
      // )}
      classBgColor={eventLoggedUserStatus.canSignOut ? 'bg-danger' : undefined}
      // classHoverBgColor={eventUser ? 'hover:bg-danger' : undefined}
      className={cn('border w-auto', className)}
      name={
        eventLoggedUserStatus.canSignOut
          ? `Отменить запись${
              eventLoggedUserStatus.userEventStatus === 'reserve'
                ? ' в резерв'
                : ''
            }`
          : eventLoggedUserStatus.canSignIn || !loggedUser
          ? 'Записаться'
          : isUserQuestionnaireFilled
          ? eventLoggedUserStatus.canSignInReserve
            ? 'Записаться в резерв'
            : 'Мест нет'
          : 'Заполните свою анкету'
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
