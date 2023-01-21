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
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import EventProfit from './EventProfit'

const TextStatus = ({ children, className }) => (
  <div
    className={cn(
      'flex justify-center items-center text-base tablet:text-lg font-bold uppercase px-1',
      className
    )}
  >
    {children}
  </div>
)

const EventButtonSignIn = ({
  eventId,
  className,
  noButtonIfAlreadySignIn,
  thin,
  classNameProfit,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const event = useRecoilValue(eventSelector(eventId))
  const loggedUser = useRecoilValue(loggedUserAtom)
  const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)

  const router = useRouter()

  const eventLoggedUserStatus = useRecoilValue(
    loggedUserToEventStatusSelector(eventId)
  )

  const isUserQuestionnaireFilled = isUserQuestionnaireFilledFunc(loggedUser)

  return isLoggedUserAdmin && event.status === 'closed' ? (
    <EventProfit eventId={event._id} className={classNameProfit} />
  ) : // <div
  //   className={cn(
  //     'flex justify-center items-center text-base tablet:text-lg font-bold uppercase text-white bg-success px-3',
  //     className
  //   )}
  // >
  //   Закрыто
  // </div>
  event.status === 'canceled' ? (
    <TextStatus className={cn('text-danger', className)}>Отменено</TextStatus>
  ) : eventLoggedUserStatus.isEventExpired ? (
    <TextStatus className={cn('text-success', className)}>Завершено</TextStatus>
  ) : eventLoggedUserStatus.userEventStatus === 'assistant' ? (
    <TextStatus className={cn('text-general', className)}>Ведущий</TextStatus>
  ) : (noButtonIfAlreadySignIn && eventLoggedUserStatus.canSignOut) ||
    (eventLoggedUserStatus.isEventInProcess &&
      eventLoggedUserStatus.canSignOut) ? (
    <TextStatus className={cn('text-blue-600', className)}>
      {eventLoggedUserStatus.userEventStatus === 'reserve'
        ? 'В резерве'
        : 'Записан'}
    </TextStatus>
  ) : !eventLoggedUserStatus.canSee ? (
    <TextStatus className={cn('text-danger', className)}>
      Не доступно
    </TextStatus>
  ) : eventLoggedUserStatus.isEventInProcess &&
    (noButtonIfAlreadySignIn || !eventLoggedUserStatus.canSignIn) ? (
    <TextStatus className={cn('text-general', className)}>
      В процессе
    </TextStatus>
  ) : (
    <Button
      thin={thin}
      stopPropagation
      onClick={() => {
        if (
          !loggedUser ||
          (eventLoggedUserStatus.canSignIn &&
            !eventLoggedUserStatus.alreadySignIn)
        ) {
          modalsFunc.event.signUp(event._id)
        } else if (loggedUser.status === 'ban') {
          modalsFunc.event.cantSignUp()
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
      className={cn('border w-auto self-center', className)}
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
