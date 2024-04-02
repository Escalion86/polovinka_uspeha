import eventPricesWithStatus from './eventPricesWithStatus'
import isObject from './isObject'

const subEventsSummator = (subEvents) => {
  if (!isObject(subEvents)) return

  const sum = subEvents.reduce((sum, subEvent) => {
    let result
    if (Object.keys(sum).length === 0)
      result = {
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

      result = {
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
          noReg:
            sum.usersStatusAccess?.noReg || subEvent.usersStatusAccess?.noReg,
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

    const realMaxMembers = Math.min(
      typeof result?.maxParticipants === 'number'
        ? result.maxParticipants
        : 9999,
      Math.min(
        typeof result?.maxMansMember === 'number' ? result.maxMansMember : 9999,
        typeof result?.maxMans === 'number' ? result.maxMans : 9999
      ) +
        Math.min(
          typeof result?.maxWomansMember === 'number'
            ? result.maxWomansMember
            : 9999,
          typeof result?.maxWomans === 'number' ? result.maxWomans : 9999
        )
    )

    const realMaxNovice = Math.min(
      typeof result?.maxParticipants === 'number'
        ? result.maxParticipants
        : 9999,
      Math.min(
        typeof result?.maxMansNovice === 'number' ? result.maxMansNovice : 9999,
        typeof result?.maxMans === 'number' ? result.maxMans : 9999
      ) +
        Math.min(
          typeof result?.maxWomansNovice === 'number'
            ? result.maxWomansNovice
            : 9999,
          typeof result?.maxWomans === 'number' ? result.maxWomans : 9999
        )
    )

    return {
      ...result,
      realMaxMembers: realMaxMembers >= 9999 ? null : realMaxMembers,
      realMaxNovice: realMaxNovice >= 9999 ? null : realMaxNovice,
    }
  }, {})

  delete sum.id
  delete sum._id
  delete sum.description

  return sum
}

export default subEventsSummator
