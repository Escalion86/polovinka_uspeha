import birthDateToAge from './birthDateToAge'
import { DEFAULT_EVENT } from './constants'
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
      userStatus: undefined,
      userEventStatus: undefined,
      status: 'no eventId',
    }

  const isEventExpired = isEventExpiredFunc(event)
  const isEventInProcess = isEventInProcessFunc(event)

  if (!user?._id)
    return {
      canSee: event.usersStatusAccess?.noReg && event.showOnSite,
      alreadySignIn: false,
      canSignIn: false,
      canSignInReserve: false,
      canSignOut: false,
      isEventExpired,
      isEventInProcess,
      userStatus: undefined,
      userEventStatus: undefined,
      status: 'user not signIn in site',
    }

  const userEvent =
    user?._id &&
    eventUsersFull.find((eventUser) => eventUser.user?._id === user._id)

  const alreadySignIn = !!userEvent

  const userStatus = userEvent?.userStatus
  const userEventStatus = userEvent?.status

  const canSignOut = alreadySignIn && !isEventExpired

  const userAge = new Number(birthDateToAge(user.birthday, false, false))

  const isUserTooOld =
    userAge &&
    ((user.gender === 'male' &&
      typeof event.maxMansAge === 'number' &&
      event.maxMansAge < userAge) ||
      (user.gender === 'famale' &&
        typeof event.maxWomansAge === 'number' &&
        event.maxWomansAge < userAge))

  const isUserTooYoung =
    userAge &&
    ((user.gender === 'male' &&
      typeof event.maxMansAge === 'number' &&
      event.minMansAge > userAge) ||
      (user.gender === 'famale' &&
        typeof event.maxWomansAge === 'number' &&
        event.minWomansAge > userAge))

  const isAgeOfUserCorrect = !isUserTooOld && !isUserTooYoung
  const isUserStatusCorrect = user.status
    ? event.usersStatusAccess[user.status]
    : false

  const canSee =
    ['admin', 'moder', 'dev'].includes(user.role) ||
    (event.showOnSite &&
      (alreadySignIn || (isAgeOfUserCorrect && isUserStatusCorrect)))

  // if (user.status === 'ban' || userEvent?.status === 'ban')
  //   return {
  //     canSee,
  //     alreadySignIn,
  //     canSignIn: false,
  //     canSignInReserve: false,
  //     canSignOut: false,
  //     isEventExpired,
  //     isEventInProcess,
  //     userEventStatus: userEvent?.status,
  //     status: 'user status is banned',
  //   }

  if (!isUserQuestionnaireFilled(user))
    return {
      canSee,
      alreadySignIn,
      canSignIn: false,
      canSignInReserve: false,
      canSignOut,
      isEventExpired,
      isEventInProcess,
      userStatus,
      userEventStatus,
      status: 'user questionnaire not filled',
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
      userStatus,
      userEventStatus,
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
      userStatus,
      userEventStatus,
      status: 'event expired',
    }
  const eventMans = eventUsersFull.filter(
    (item) => item.user?.gender == 'male' && item.status === 'participant'
  )
  const eventWomans = eventUsersFull.filter(
    (item) => item.user?.gender == 'famale' && item.status === 'participant'
  )
  const eventMansCount = eventMans.length
  const eventWomansCount = eventWomans.length
  const eventParticipantsCount = eventWomansCount + eventMansCount

  const canSignInReserve =
    (event.isReserveActive ?? DEFAULT_EVENT.isReserveActive) &&
    isAgeOfUserCorrect &&
    isUserStatusCorrect

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
      userStatus,
      userEventStatus,
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
      userStatus,
      userEventStatus,
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
      userStatus,
      userEventStatus,
      status: 'event full of womans',
    }

  const eventMansNoviceCount = eventMans.filter(
    (item) => !item.user?.status || item.user?.status === 'novice'
  ).length
  const eventWomansNoviceCount = eventWomans.filter(
    (item) => !item.user?.status || item.user?.status === 'novice'
  ).length
  const eventMansMemberCount = eventMans.filter(
    (item) => item.user?.status === 'member'
  ).length
  const eventWomansMemberCount = eventWomans.filter(
    (item) => item.user?.status === 'member'
  ).length

  if (user.gender === 'male') {
    if (
      (!user.status || user.status === 'novice') &&
      typeof event.maxMansNovice === 'number' &&
      event.maxMansNovice <= eventMansNoviceCount
    )
      return {
        canSee,
        alreadySignIn,
        canSignIn: false,
        canSignInReserve,
        canSignOut,
        isEventExpired,
        isEventInProcess,
        userStatus,
        userEventStatus,
        status: 'event full of novice mans',
      }
    if (
      user.status === 'member' &&
      typeof event.maxMansMember === 'number' &&
      event.maxMansMember <= eventMansMemberCount
    )
      return {
        canSee,
        alreadySignIn,
        canSignIn: false,
        canSignInReserve,
        canSignOut,
        isEventExpired,
        isEventInProcess,
        userStatus,
        userEventStatus,
        status: 'event full of member mans',
      }
  }
  if (user.gender === 'famale') {
    if (
      (!user.status || user.status === 'novice') &&
      typeof event.maxWomansNovice === 'number' &&
      event.maxWomansNovice <= eventWomansNoviceCount
    )
      return {
        canSee,
        alreadySignIn,
        canSignIn: false,
        canSignInReserve,
        canSignOut,
        isEventExpired,
        isEventInProcess,
        userStatus,
        userEventStatus,
        status: 'event full of novice womans',
      }
    if (
      user.status === 'member' &&
      typeof event.maxWomansMember === 'number' &&
      event.maxWomansMember <= eventWomansMemberCount
    )
      return {
        canSee,
        alreadySignIn,
        canSignIn: false,
        canSignInReserve,
        canSignOut,
        isEventExpired,
        isEventInProcess,
        userStatus,
        userEventStatus,
        status: 'event full of member womans',
      }
  }

  return {
    canSee,
    alreadySignIn,
    canSignIn: isAgeOfUserCorrect && isUserStatusCorrect,
    canSignInReserve,
    canSignOut,
    isEventExpired,
    isEventInProcess,
    userStatus,
    userEventStatus,
    status: 'ok',
  }
}

export default userToEventStatus
