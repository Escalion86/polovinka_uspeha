import eventPricesWithStatus from './eventPricesWithStatus'
import isObject from './isObject'

const subEventsSummator = (subEvents) => {
  if (!isObject(subEvents)) return

  return subEvents.reduce((sum, subEvent) => {
    if (Object.keys(sum).length === 0)
      return {
        ...subEvent,
        usersStatusAccess: subEvent.usersStatusAccess
          ? { ...subEvent.usersStatusAccess }
          : { novice: false, member: false },
        usersStatusDiscountResult: eventPricesWithStatus(subEvent),
        title: 'Суммарный результат',
      }
    else {
      const summator = (key) =>
        sum[key] === null || subEvent[key] === null
          ? null
          : sum[key] + subEvent[key]

      const usersStatusDiscountResult = eventPricesWithStatus(subEvent)

      return {
        ...sum,
        maxParticipants: summator('maxParticipants'),
        maxMans: summator('maxMans'),
        maxWomans: summator('maxWomans'),
        maxMansNovice: summator('maxMansNovice'),
        maxMansMember: summator('maxMansMember'),
        maxWomansNovice: summator('maxWomansNovice'),
        maxWomansMember: summator('maxWomansMember'),
        minMansAge: Math.min(sum.minMansAge, subEvent.minMansAge),
        minWomansAge: Math.min(sum.minWomansAge, subEvent.minWomansAge),
        maxMansAge: Math.max(sum.maxMansAge, subEvent.maxMansAge),
        maxWomansAge: Math.max(sum.maxWomansAge, subEvent.maxWomansAge),
        // if (!sum.usersStatusAccess)
        //   sum.usersStatusAccess = { novice: false, member: false }
        usersStatusAccess: {
          novice:
            sum.usersStatusAccess?.novice || subEvent.usersStatusAccess?.novice,
          member:
            sum.usersStatusAccess?.member || subEvent.usersStatusAccess?.member,
        },
        isReserveActive: sum.isReserveActive || subEvent.isReserveActive,
        usersRelationshipAccess:
          !sum.usersRelationshipAccess || sum.usersRelationshipAccess === 'yes'
            ? 'yes'
            : sum.usersRelationshipAccess === 'no'
              ? subEvent.usersRelationshipAccess === 'yes' ||
                subEvent.usersRelationshipAccess === 'only'
                ? 'yes'
                : 'no'
              : subEvent.usersRelationshipAccess === 'no' ||
                  subEvent.usersRelationshipAccess === 'yes'
                ? 'yes'
                : 'only',

        usersStatusDiscountResult: {
          novice: Math.min(
            sum.usersStatusDiscountResult?.novice,
            usersStatusDiscountResult.novice
          ),
          noviceFrom:
            sum.usersStatusDiscountResult.noviceFrom ||
            sum.usersStatusDiscountResult?.novice !==
              usersStatusDiscountResult.novice,
          member: Math.min(
            sum.usersStatusDiscountResult?.member,
            usersStatusDiscountResult.member
          ),
          memberFrom:
            sum.usersStatusDiscountResult.memberFrom ||
            sum.usersStatusDiscountResult?.member !==
              usersStatusDiscountResult.member,
        },
      }
    }
  }, {})
}

export default subEventsSummator
