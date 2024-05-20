import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import birthDateToAge from './birthDateToAge'
import { DEFAULT_EVENT } from './constants'
import isEventCanceled from './isEventCanceled'
import isEventExpiredFunc from './isEventExpired'
import isEventInProcessFunc from './isEventInProcess'
import isUserQuestionnaireFilled from './isUserQuestionnaireFilled'
import { getRecoil } from 'recoil-nexus'
import isUserRelationshipCorrectForEvent from '@components/isUserRelationshipCorrectForEvent'

const userToEventStatus = (event, user, eventUsersFull, subEventSum, rules) => {
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
      isAgeOfUserCorrect: undefined,
      isUserStatusCorrect: undefined,
      isUserRelationshipCorrect: undefined,
    }

  const isEventExpired = isEventExpiredFunc(event)
  const isEventInProcess = isEventInProcessFunc(event)

  if (!user?._id)
    return {
      canSee: subEventSum.usersStatusAccess?.noReg && event.showOnSite,
      alreadySignIn: false,
      canSignIn: false,
      canSignInReserve: false,
      canSignOut: false,
      isEventExpired,
      isEventInProcess,
      userStatus: undefined,
      userEventStatus: undefined,
      status: 'user not signIn in site',
      isAgeOfUserCorrect: undefined,
      isUserStatusCorrect: undefined,
      isUserRelationshipCorrect: undefined,
    }

  const userEvent =
    user?._id &&
    eventUsersFull.find((eventUser) => eventUser.user?._id === user._id)

  const alreadySignIn = !!userEvent

  const userStatus = userEvent?.userStatus
  const userEventStatus = userEvent?.status

  const canSignOut = alreadySignIn && !isEventExpired

  const serverDate = new Date(getRecoil(serverSettingsAtom)?.dateTime)
  const userAge = new Number(
    birthDateToAge(user.birthday, serverDate, false, false)
  )

  const isUserTooOld =
    userAge &&
    ((user.gender === 'male' &&
      typeof subEventSum.maxMansAge === 'number' &&
      subEventSum.maxMansAge < userAge) ||
      (user.gender === 'famale' &&
        typeof subEventSum.maxWomansAge === 'number' &&
        subEventSum.maxWomansAge < userAge))

  const isUserTooYoung =
    userAge &&
    ((user.gender === 'male' &&
      typeof subEventSum.maxMansAge === 'number' &&
      subEventSum.minMansAge > userAge) ||
      (user.gender === 'famale' &&
        typeof subEventSum.maxWomansAge === 'number' &&
        subEventSum.minWomansAge > userAge))

  const isAgeOfUserCorrect = !isUserTooOld && !isUserTooYoung
  const isUserStatusCorrect =
    user.status === 'ban'
      ? false
      : rules?.userStatus
        ? rules?.userStatus === 'any'
          ? true
          : user.status
            ? rules?.userStatus[user.status]
            : rules?.userStatus['novice']
        : user.status
          ? subEventSum.usersStatusAccess[user.status]
          : subEventSum.usersStatusAccess['novice']
  const isUserRelationshipCorrect = isUserRelationshipCorrectForEvent(
    user,
    subEventSum,
    rules
  )

  // TODO Поправить права роли
  const canSee =
    ['admin', 'moder', 'dev'].includes(user.role) ||
    (event.showOnSite &&
      (alreadySignIn ||
        (isAgeOfUserCorrect &&
          isUserStatusCorrect &&
          isUserRelationshipCorrect)))

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
      isAgeOfUserCorrect,
      isUserStatusCorrect,
      isUserRelationshipCorrect,
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
      isAgeOfUserCorrect,
      isUserStatusCorrect,
      isUserRelationshipCorrect,
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
      isAgeOfUserCorrect,
      isUserStatusCorrect,
      isUserRelationshipCorrect,
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
    (subEventSum.isReserveActive ?? DEFAULT_EVENT.isReserveActive) &&
    isAgeOfUserCorrect &&
    isUserStatusCorrect &&
    isUserRelationshipCorrect

  if (
    typeof subEventSum.maxParticipants === 'number' &&
    subEventSum.maxParticipants <= eventParticipantsCount
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
      isAgeOfUserCorrect,
      isUserStatusCorrect,
      isUserRelationshipCorrect,
    }

  if (
    user.gender === 'male' &&
    typeof subEventSum.maxMans === 'number' &&
    subEventSum.maxMans <= eventMansCount
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
      isAgeOfUserCorrect,
      isUserStatusCorrect,
      isUserRelationshipCorrect,
    }

  if (
    user.gender === 'famale' &&
    typeof subEventSum.maxWomans === 'number' &&
    subEventSum.maxWomans <= eventWomansCount
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
      isAgeOfUserCorrect,
      isUserStatusCorrect,
      isUserRelationshipCorrect,
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
      typeof subEventSum.maxMansNovice === 'number' &&
      subEventSum.maxMansNovice <= eventMansNoviceCount
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
        isAgeOfUserCorrect,
        isUserStatusCorrect,
        isUserRelationshipCorrect,
      }
    if (
      user.status === 'member' &&
      typeof subEventSum.maxMansMember === 'number' &&
      subEventSum.maxMansMember <= eventMansMemberCount
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
        isAgeOfUserCorrect,
        isUserStatusCorrect,
        isUserRelationshipCorrect,
      }
  }
  if (user.gender === 'famale') {
    if (
      (!user.status || user.status === 'novice') &&
      typeof subEventSum.maxWomansNovice === 'number' &&
      subEventSum.maxWomansNovice <= eventWomansNoviceCount
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
        isAgeOfUserCorrect,
        isUserStatusCorrect,
        isUserRelationshipCorrect,
      }
    if (
      user.status === 'member' &&
      typeof subEventSum.maxWomansMember === 'number' &&
      subEventSum.maxWomansMember <= eventWomansMemberCount
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
        isAgeOfUserCorrect,
        isUserStatusCorrect,
        isUserRelationshipCorrect,
      }
  }

  return {
    canSee,
    alreadySignIn,
    canSignIn:
      isAgeOfUserCorrect && isUserStatusCorrect && isUserRelationshipCorrect,
    canSignInReserve,
    canSignOut,
    isEventExpired,
    isEventInProcess,
    userStatus,
    userEventStatus,
    status: 'ok',
    isAgeOfUserCorrect,
    isUserStatusCorrect,
    isUserRelationshipCorrect,
  }
}

export default userToEventStatus
