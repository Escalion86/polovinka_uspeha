import birthDateToAge from './birthDateToAge'
import { DEFAULT_EVENT } from './constants'
import getMinutesBetween from './getMinutesBetween'
import isEventCanceled from './isEventCanceled'
import isEventExpiredFunc from './isEventExpired'
import isEventInProcessFunc from './isEventInProcess'
import isUserQuestionnaireFilled from './isUserQuestionnaireFilled'

const userToEventStatus = (event, user, eventUsersFull) => {
  if (!event?._id)
    return {
      canSee: false,
      alreadySignIn: false,
      canSignIn: false,
      canSignInReserve: false,
      canSignOut: false,
      isEventExpired: true,
      isEventInProcess: false,
      userEventStatus: undefined,
      status: 'no eventId',
    }

  const isEventExpired = isEventExpiredFunc(event)
  const isEventInProcess = isEventInProcessFunc(event)

  if (!user?._id)
    return {
      canSee: event.usersStatusAccess?.noReg,
      alreadySignIn: false,
      canSignIn: false,
      canSignInReserve: false,
      canSignOut: false,
      isEventExpired,
      isEventInProcess,
      userEventStatus: undefined,
      status: 'user not signIn in site',
    }

  const userEvent =
    user?._id &&
    eventUsersFull.find((eventUser) => eventUser.user?._id === user._id)

  const alreadySignIn = !!userEvent

  const canSignOut = alreadySignIn && !isEventExpired

  const canSee =
    alreadySignIn ||
    (user.status ? event.usersStatusAccess[user.status] : false)

  if (user.status === 'ban' || userEvent?.status === 'ban')
    return {
      canSee,
      alreadySignIn,
      canSignIn: false,
      canSignInReserve: false,
      canSignOut: false,
      isEventExpired,
      isEventInProcess,
      userEventStatus: userEvent?.status,
      status: 'user status is banned',
    }

  if (isEventCanceled(event))
    return {
      canSee,
      alreadySignIn,
      canSignIn: false,
      canSignInReserve: false,
      canSignOut,
      isEventExpired,
      isEventInProcess,
      userEventStatus: userEvent?.status,
      status: 'event canceled',
    }

  if (isEventExpired)
    return {
      canSee,
      alreadySignIn,
      canSignIn: false,
      canSignInReserve: false,
      canSignOut,
      isEventExpired,
      isEventInProcess,
      userEventStatus: userEvent?.status,
      status: 'event expired',
    }

  if (!isUserQuestionnaireFilled(user))
    return {
      canSee,
      alreadySignIn,
      canSignIn: false,
      canSignInReserve: false,
      canSignOut,
      isEventExpired,
      isEventInProcess,
      userEventStatus: userEvent?.status,
      status: 'user questionnaire not filled',
    }

  const eventMansCount = eventUsersFull.filter(
    (item) => item.user?.gender == 'male' && item.status === 'participant'
  ).length
  const eventWomansCount = eventUsersFull.filter(
    (item) => item.user?.gender == 'famale' && item.status === 'participant'
  ).length
  const eventParticipantsCount = eventWomansCount + eventMansCount

  const canSignInReserve =
    event.isReserveActive ?? DEFAULT_EVENT.isReserveActive

  if (
    typeof event.maxParticipants === 'number' &&
    event.maxParticipants <= eventParticipantsCount
  )
    return {
      canSee,
      alreadySignIn,
      canSignIn: false,
      canSignInReserve,
      canSignOut,
      isEventExpired,
      isEventInProcess,
      userEventStatus: userEvent?.status,
      status: 'event full',
    }

  if (
    user.gender === 'male' &&
    typeof event.maxMans === 'number' &&
    event.maxMans <= eventMansCount
  )
    return {
      canSee,
      alreadySignIn,
      canSignIn: false,
      canSignInReserve,
      canSignOut,
      isEventExpired,
      isEventInProcess,
      userEventStatus: userEvent?.status,
      status: 'event full of mans',
    }

  if (
    user.gender === 'famale' &&
    typeof event.maxWomans === 'number' &&
    event.maxWomans <= eventWomansCount
  )
    return {
      canSee,
      alreadySignIn,
      canSignIn: false,
      canSignInReserve,
      canSignOut,
      isEventExpired,
      isEventInProcess,
      userEventStatus: userEvent?.status,
      status: 'event full of womans',
    }

  const userAge = new Number(birthDateToAge(user.birthday, false, false))

  if (
    (user.gender === 'male' &&
      typeof event.maxMansAge === 'number' &&
      event.maxMansAge < userAge) ||
    (user.gender === 'famale' &&
      typeof event.maxWomansAge === 'number' &&
      event.maxWomansAge < userAge)
  )
    return {
      canSee,
      alreadySignIn,
      canSignIn: false,
      canSignInReserve,
      canSignOut,
      isEventExpired,
      isEventInProcess,
      userEventStatus: userEvent?.status,
      status: 'user too old',
    }
  if (
    (user.gender === 'male' &&
      typeof event.maxMansAge === 'number' &&
      event.minMansAge > userAge) ||
    (user.gender === 'famale' &&
      typeof event.maxWomansAge === 'number' &&
      event.minWomansAge > userAge)
  )
    return {
      canSee,
      alreadySignIn,
      canSignIn: false,
      canSignInReserve,
      canSignOut,
      isEventExpired,
      isEventInProcess,
      userEventStatus: userEvent?.status,
      status: 'user too young',
    }

  return {
    canSee,
    alreadySignIn,
    canSignIn: true,
    canSignInReserve,
    canSignOut,
    isEventExpired,
    isEventInProcess,
    userEventStatus: userEvent?.status,
    status: 'ok',
  }
}

export default userToEventStatus
