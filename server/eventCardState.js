import isUserRelationshipCorrectForEvent from '@components/isUserRelationshipCorrectForEvent'
import birthDateToAge from '@helpers/birthDateToAge'
import { DEFAULT_EVENT } from '@helpers/constantsServer'
import getDiffBetweenDates from '@helpers/getDiffBetweenDates'
import isEventCanceled from '@helpers/isEventCanceled'
import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'
import subEventsSummator from '@helpers/subEventsSummator'

const DEFAULT_CARD_LIMITS = {
  maxParticipants: null,
  maxMans: null,
  maxWomans: null,
  maxMansNovice: null,
  maxMansMember: null,
  maxWomansNovice: null,
  maxWomansMember: null,
  minMansAge: 18,
  minWomansAge: 18,
  maxMansAge: 60,
  maxWomansAge: 60,
  usersStatusAccess: {
    noReg: true,
    novice: true,
    member: true,
  },
  isReserveActive: true,
  usersRelationshipAccess: 'yes',
}

const getSubEventSum = (event) => {
  if (Array.isArray(event?.subEvents) && event.subEvents.length > 0) {
    return subEventsSummator(event.subEvents)
  }

  return {
    ...DEFAULT_CARD_LIMITS,
    maxParticipants:
      typeof event?.maxParticipants === 'number' ? event.maxParticipants : null,
    maxMans: typeof event?.maxMans === 'number' ? event.maxMans : null,
    maxWomans: typeof event?.maxWomans === 'number' ? event.maxWomans : null,
    usersRelationshipAccess:
      event?.usersRelationshipAccess || DEFAULT_CARD_LIMITS.usersRelationshipAccess,
  }
}

const getParticipantsStats = (eventUsersFull = []) => {
  const participants = eventUsersFull.filter(
    (item) => item?.status === 'participant'
  )

  const eventMans = participants.filter((item) => item?.user?.gender === 'male')
  const eventWomans = participants.filter(
    (item) => item?.user?.gender === 'famale'
  )

  return {
    participantsCount: participants.length,
    participantsMaleCount: eventMans.length,
    participantsFemaleCount: eventWomans.length,
    participantsMaleNoviceCount: eventMans.filter(
      (item) => !item?.user?.status || item?.user?.status === 'novice'
    ).length,
    participantsFemaleNoviceCount: eventWomans.filter(
      (item) => !item?.user?.status || item?.user?.status === 'novice'
    ).length,
    participantsMaleMemberCount: eventMans.filter(
      (item) => item?.user?.status === 'member'
    ).length,
    participantsFemaleMemberCount: eventWomans.filter(
      (item) => item?.user?.status === 'member'
    ).length,
  }
}

const getFreePlaces = (maxValue, currentValue) =>
  typeof maxValue === 'number'
    ? Math.max(0, (maxValue ?? 0) - (currentValue ?? 0))
    : null

const getEventVisibilityState = (event, serverDate) => {
  const nowDate = serverDate ? new Date(serverDate) : new Date()
  return {
    isEventHidden: !event?.showOnSite,
    isEventExpired:
      !!event?.dateEnd && getDiffBetweenDates(event.dateEnd, nowDate) >= 0,
    isEventInProcess:
      !!event?.dateStart &&
      !!event?.dateEnd &&
      getDiffBetweenDates(event.dateStart, nowDate) >= 0 &&
      getDiffBetweenDates(event.dateEnd, nowDate) <= 0,
    isEventCanceled: isEventCanceled(event),
  }
}

const getUserToEventStatus = ({
  event,
  user,
  eventUsersFull,
  subEventSum,
  rules,
  activeRoleName,
  serverDate,
}) => {
  const baseEmptyStatus = {
    canSee: false,
    alreadySignIn: false,
    canSignIn: false,
    canSignInReserve: false,
    canSignOut: false,
    isEventExpired: false,
    isEventInProcess: false,
    isEventHidden: false,
    isEventCanceled: false,
    userStatus: undefined,
    userEventStatus: undefined,
    status: 'no eventId',
    isAgeOfUserCorrect: undefined,
    isUserStatusCorrect: undefined,
    isUserRelationshipCorrect: undefined,
  }

  if (!event?._id) return baseEmptyStatus

  const { isEventHidden, isEventExpired, isEventInProcess, isEventCanceled } =
    getEventVisibilityState(event, serverDate)

  if (event.blank) {
    return {
      ...baseEmptyStatus,
      canSee: !isEventHidden,
      isEventExpired,
      isEventInProcess,
      isEventHidden,
      isEventCanceled,
      status: 'event blank',
    }
  }

  if (!user?._id) {
    return {
      ...baseEmptyStatus,
      canSee: !!subEventSum?.usersStatusAccess?.noReg && !isEventHidden,
      isEventExpired,
      isEventInProcess,
      isEventHidden,
      isEventCanceled,
      status: 'user not signIn in site',
    }
  }

  if (eventUsersFull?.length > 0 && !eventUsersFull[0]?.user) {
    return {
      ...baseEmptyStatus,
      canSee: !!subEventSum?.usersStatusAccess?.noReg && !isEventHidden,
      isEventExpired,
      isEventInProcess,
      isEventHidden,
      isEventCanceled,
      status: 'error eventUsersFull',
    }
  }

  const userEvent =
    user?._id &&
    eventUsersFull?.find(
      (eventUser) => String(eventUser?.user?._id || '') === String(user._id)
    )

  const alreadySignIn = !!userEvent
  const userStatus = userEvent?.userStatus
  const userEventStatus = userEvent?.status
  const canSignOut = alreadySignIn && !isEventExpired

  const userAge = Number(birthDateToAge(user.birthday, serverDate, false, false))

  const isUserTooOld =
    userAge &&
    ((user.gender === 'male' &&
      typeof subEventSum?.maxMansAge === 'number' &&
      subEventSum.maxMansAge < userAge) ||
      (user.gender === 'famale' &&
        typeof subEventSum?.maxWomansAge === 'number' &&
        subEventSum.maxWomansAge < userAge))

  const isUserTooYoung =
    userAge &&
    ((user.gender === 'male' &&
      typeof subEventSum?.maxMansAge === 'number' &&
      subEventSum.minMansAge > userAge) ||
      (user.gender === 'famale' &&
        typeof subEventSum?.maxWomansAge === 'number' &&
        subEventSum.minWomansAge > userAge))

  const isAgeOfUserCorrect = !isUserTooOld && !isUserTooYoung
  const userStatusKey = user.status || 'novice'
  const isUserStatusCorrect =
    user.status === 'ban'
      ? false
      : rules?.userStatus === 'any' ||
          rules?.userStatus === userStatusKey ||
          !!subEventSum?.usersStatusAccess?.[userStatusKey]

  const isUserRelationshipCorrect = isUserRelationshipCorrectForEvent(
    user,
    subEventSum,
    rules
  )
  const isGenderAccessBlocked =
    (user.gender === 'male' && subEventSum?.maxMans === 0) ||
    (user.gender === 'famale' && subEventSum?.maxWomans === 0)
  const roleForAccess = activeRoleName || user.role

  const canSee =
    ['admin', 'moder', 'dev'].includes(roleForAccess) ||
    (!isEventHidden &&
      (alreadySignIn ||
        (isAgeOfUserCorrect &&
          isUserStatusCorrect &&
          isUserRelationshipCorrect &&
          !isGenderAccessBlocked)))

  if (!isUserQuestionnaireFilled(user)) {
    return {
      canSee,
      alreadySignIn,
      canSignIn: false,
      canSignInReserve: false,
      canSignOut,
      isEventExpired,
      isEventInProcess,
      isEventHidden,
      isEventCanceled,
      userStatus,
      userEventStatus,
      status: 'user questionnaire not filled',
      isAgeOfUserCorrect,
      isUserStatusCorrect,
      isUserRelationshipCorrect,
    }
  }

  if (isEventHidden) {
    return {
      canSee,
      alreadySignIn,
      canSignIn: false,
      canSignInReserve: false,
      canSignOut,
      isEventExpired,
      isEventInProcess,
      isEventHidden,
      isEventCanceled,
      userStatus,
      userEventStatus,
      status: 'event hidden',
      isAgeOfUserCorrect,
      isUserStatusCorrect,
      isUserRelationshipCorrect,
    }
  }

  if (isEventCanceled) {
    return {
      canSee,
      alreadySignIn,
      canSignIn: false,
      canSignInReserve: false,
      canSignOut,
      isEventExpired,
      isEventInProcess,
      isEventHidden,
      isEventCanceled,
      userStatus,
      userEventStatus,
      status: 'event canceled',
      isAgeOfUserCorrect,
      isUserStatusCorrect,
      isUserRelationshipCorrect,
    }
  }

  if (isEventExpired) {
    return {
      canSee,
      alreadySignIn,
      canSignIn: false,
      canSignInReserve: false,
      canSignOut,
      isEventExpired,
      isEventInProcess,
      isEventHidden,
      isEventCanceled,
      userStatus,
      userEventStatus,
      status: 'event expired',
      isAgeOfUserCorrect,
      isUserStatusCorrect,
      isUserRelationshipCorrect,
    }
  }

  const participantsStats = getParticipantsStats(eventUsersFull)

  const canSignInReserve =
    (subEventSum?.isReserveActive ?? DEFAULT_EVENT.isReserveActive) &&
    isAgeOfUserCorrect &&
    isUserStatusCorrect &&
    isUserRelationshipCorrect

  const canSignInReserveFinal = isGenderAccessBlocked
    ? false
    : canSignInReserve

  if (
    typeof subEventSum?.maxParticipants === 'number' &&
    subEventSum.maxParticipants <= participantsStats.participantsCount
  ) {
    return {
      canSee,
      alreadySignIn,
      canSignIn: false,
      canSignInReserve: canSignInReserveFinal,
      canSignOut,
      isEventExpired,
      isEventInProcess,
      isEventHidden,
      isEventCanceled,
      userStatus,
      userEventStatus,
      status: 'event full',
      isAgeOfUserCorrect,
      isUserStatusCorrect,
      isUserRelationshipCorrect,
    }
  }

  if (
    user.gender === 'male' &&
    typeof subEventSum?.maxMans === 'number' &&
    subEventSum.maxMans <= participantsStats.participantsMaleCount
  ) {
    return {
      canSee,
      alreadySignIn,
      canSignIn: false,
      canSignInReserve: canSignInReserveFinal,
      canSignOut,
      isEventExpired,
      isEventInProcess,
      isEventHidden,
      isEventCanceled,
      userStatus,
      userEventStatus,
      status: 'event full of mans',
      isAgeOfUserCorrect,
      isUserStatusCorrect,
      isUserRelationshipCorrect,
    }
  }

  if (
    user.gender === 'famale' &&
    typeof subEventSum?.maxWomans === 'number' &&
    subEventSum.maxWomans <= participantsStats.participantsFemaleCount
  ) {
    return {
      canSee,
      alreadySignIn,
      canSignIn: false,
      canSignInReserve: canSignInReserveFinal,
      canSignOut,
      isEventExpired,
      isEventInProcess,
      isEventHidden,
      isEventCanceled,
      userStatus,
      userEventStatus,
      status: 'event full of womans',
      isAgeOfUserCorrect,
      isUserStatusCorrect,
      isUserRelationshipCorrect,
    }
  }

  if (user.gender === 'male') {
    if (
      (!user.status || user.status === 'novice') &&
      typeof subEventSum?.maxMansNovice === 'number' &&
      subEventSum.maxMansNovice <= participantsStats.participantsMaleNoviceCount
    ) {
      return {
        canSee,
        alreadySignIn,
        canSignIn: false,
        canSignInReserve: canSignInReserveFinal,
        canSignOut,
        isEventExpired,
        isEventInProcess,
        isEventHidden,
        isEventCanceled,
        userStatus,
        userEventStatus,
        status: 'event full of novice mans',
        isAgeOfUserCorrect,
        isUserStatusCorrect,
        isUserRelationshipCorrect,
      }
    }

    if (
      user.status === 'member' &&
      typeof subEventSum?.maxMansMember === 'number' &&
      subEventSum.maxMansMember <= participantsStats.participantsMaleMemberCount
    ) {
      return {
        canSee,
        alreadySignIn,
        canSignIn: false,
        canSignInReserve: canSignInReserveFinal,
        canSignOut,
        isEventExpired,
        isEventInProcess,
        isEventHidden,
        isEventCanceled,
        userStatus,
        userEventStatus,
        status: 'event full of member mans',
        isAgeOfUserCorrect,
        isUserStatusCorrect,
        isUserRelationshipCorrect,
      }
    }
  }

  if (user.gender === 'famale') {
    if (
      (!user.status || user.status === 'novice') &&
      typeof subEventSum?.maxWomansNovice === 'number' &&
      subEventSum.maxWomansNovice <= participantsStats.participantsFemaleNoviceCount
    ) {
      return {
        canSee,
        alreadySignIn,
        canSignIn: false,
        canSignInReserve: canSignInReserveFinal,
        canSignOut,
        isEventExpired,
        isEventInProcess,
        isEventHidden,
        isEventCanceled,
        userStatus,
        userEventStatus,
        status: 'event full of novice womans',
        isAgeOfUserCorrect,
        isUserStatusCorrect,
        isUserRelationshipCorrect,
      }
    }

    if (
      user.status === 'member' &&
      typeof subEventSum?.maxWomansMember === 'number' &&
      subEventSum.maxWomansMember <= participantsStats.participantsFemaleMemberCount
    ) {
      return {
        canSee,
        alreadySignIn,
        canSignIn: false,
        canSignInReserve: canSignInReserveFinal,
        canSignOut,
        isEventExpired,
        isEventInProcess,
        isEventHidden,
        isEventCanceled,
        userStatus,
        userEventStatus,
        status: 'event full of member womans',
        isAgeOfUserCorrect,
        isUserStatusCorrect,
        isUserRelationshipCorrect,
      }
    }
  }

  return {
    canSee,
    alreadySignIn,
    canSignIn:
      isAgeOfUserCorrect && isUserStatusCorrect && isUserRelationshipCorrect,
    canSignInReserve: canSignInReserveFinal,
    canSignOut,
    isEventExpired,
    isEventInProcess,
    isEventHidden,
    isEventCanceled,
    userStatus,
    userEventStatus,
    status: 'ok',
    isAgeOfUserCorrect,
    isUserStatusCorrect,
    isUserRelationshipCorrect,
  }
}

const getStatusLabel = (event, eventStatus) => {
  if (event?.status === 'canceled' || eventStatus?.isEventCanceled) {
    return 'Отменено'
  }

  if (eventStatus?.isEventExpired || event?.status === 'closed') {
    return 'Завершено'
  }

  if (eventStatus?.userEventStatus === 'reserve') {
    return 'В резерве'
  }

  if (eventStatus?.userEventStatus === 'participant') {
    return 'Записан'
  }

  if (eventStatus?.userEventStatus === 'assistant') {
    return 'Ведущий'
  }

  if (
    !eventStatus?.canSignIn &&
    !eventStatus?.canSignOut &&
    !eventStatus?.canSignInReserve
  ) {
    return eventStatus?.isUserRelationshipCorrect === false ? 'Ограничение' : 'Мест нет'
  }

  return null
}

export const buildEventCardState = ({
  event,
  eventUsers = [],
  usersById = new Map(),
  loggedUser = null,
  directionRules = null,
  activeRoleName = null,
  serverDate = new Date(),
}) => {
  if (!event?._id) return null

  const targetEventId = String(event._id)
  const eventUsersFull = eventUsers.map((item) => ({
    ...item,
    user: usersById.get(String(item?.userId || '')) || null,
  }))

  const participantsStats = getParticipantsStats(eventUsersFull)
  const subEventSum = getSubEventSum(event)
  const eventStatus = getUserToEventStatus({
    event,
    user: loggedUser,
    eventUsersFull,
    subEventSum,
    rules: directionRules,
    activeRoleName,
    serverDate,
  })

  return {
    eventId: targetEventId,
    maxParticipants: subEventSum.maxParticipants,
    maxMans: subEventSum.maxMans,
    maxWomans: subEventSum.maxWomans,
    hasGenderLimits:
      typeof subEventSum.maxMans === 'number' ||
      typeof subEventSum.maxWomans === 'number',
    participantsCount: participantsStats.participantsCount,
    participantsMaleCount: participantsStats.participantsMaleCount,
    participantsFemaleCount: participantsStats.participantsFemaleCount,
    participantsMaleNoviceCount: participantsStats.participantsMaleNoviceCount,
    participantsFemaleNoviceCount:
      participantsStats.participantsFemaleNoviceCount,
    participantsMaleMemberCount: participantsStats.participantsMaleMemberCount,
    participantsFemaleMemberCount:
      participantsStats.participantsFemaleMemberCount,
    freePlaces: getFreePlaces(
      subEventSum.maxParticipants,
      participantsStats.participantsCount
    ),
    freeMalePlaces: getFreePlaces(
      subEventSum.maxMans,
      participantsStats.participantsMaleCount
    ),
    freeFemalePlaces: getFreePlaces(
      subEventSum.maxWomans,
      participantsStats.participantsFemaleCount
    ),
    status: eventStatus,
    statusLabel: getStatusLabel(event, eventStatus),
  }
}
