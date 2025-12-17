'use client'

import LoadingSpinner from '@components/LoadingSpinner'
import Note from '@components/Note'
import UserName from '@components/UserName'
import Button from '@components/Button'
import formatDate from '@helpers/formatDate'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import asyncEventsUsersAllAtom from '@state/async/asyncEventsUsersAllAtom'
import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'
import usersAtomAsync from '@state/async/usersAtomAsync'
import modalsFuncAtom from '@state/modalsFuncAtom'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAtomValue } from 'jotai'
import { useCallback, useMemo } from 'react'

const pickLatestByDate = (existing, candidate) => {
  if (!candidate) return existing ?? null
  if (!existing) return candidate

  const existingTime = existing?.payAt ? new Date(existing.payAt).getTime() : 0
  const candidateTime = candidate?.payAt ? new Date(candidate.payAt).getTime() : 0

  return candidateTime >= existingTime ? candidate : existing
}

const formatCurrencyValue = (amount) => {
  if (typeof amount !== 'number') return '—'
  const hasFraction = amount % 100 !== 0
  return `${(amount / 100).toLocaleString('ru-RU', {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: hasFraction ? 2 : 0,
  })} ₽`
}

const getProgramEnabled = (program = {}) => {
  if (typeof program?.enabled === 'boolean') {
    return program.enabled === true
  }

  return program?.enabledForCenter === true || program?.enabledForClub === true
}

const getCouponStatus = (coupon, eventsById) => {
  if (!coupon) {
    return { text: 'Купон не начислен', status: 'missing' }
  }

  const { issued = null, used = null } = coupon
  const amount = used?.sum ?? issued?.sum ?? null
  const amountText = typeof amount === 'number' ? formatCurrencyValue(amount) : null

  if (used) {
    const eventId = used?.usageEventId ?? used?.eventId ?? null
    const event = eventId ? eventsById.get(String(eventId)) : null
    const eventDate = event?.dateStart
      ? formatDate(event.dateStart)
      : event?.date
      ? formatDate(event.date)
      : used?.payAt
      ? formatDate(used.payAt)
      : null
    const eventTitle = event?.title ?? null
    const eventSuffix = eventTitle
      ? ` на мероприятии "${eventTitle}"${eventDate ? ` ${eventDate}` : ''}`
      : eventDate
      ? ` ${eventDate}`
      : ''

    const prefix = amountText ? `Купон ${amountText}` : 'Купон'
    return {
      text: `${prefix} использован${eventSuffix}`.trim(),
      status: 'used',
    }
  }

  if (issued) {
    const issuedDate = issued?.payAt ? formatDate(issued.payAt) : null
    const prefix = amountText ? `Купон ${amountText}` : 'Купон'
    const suffix = issuedDate ? ` ${issuedDate}` : ''

    return {
      text: `${prefix} получен${suffix}`.trim(),
      status: 'issued',
    }
  }

  return { text: 'Данные о купоне отсутствуют', status: 'missing' }
}

const ReferralsAdminContent = () => {
  const siteSettings = useAtomValue(siteSettingsAtom)
  const users = useAtomValue(usersAtomAsync)
  const events = useAtomValue(eventsAtom)
  const eventsUsers = useAtomValue(asyncEventsUsersAllAtom)
  const payments = useAtomValue(asyncPaymentsAtom)
  const modalsFunc = useAtomValue(modalsFuncAtom)

  const program = siteSettings?.referralProgram ?? {}
  const programEnabled = getProgramEnabled(program)
  const referrerCouponAmount = program?.referrerCouponAmount ?? 0
  const referralCouponAmount = program?.referralCouponAmount ?? 0
  const requirePaidEvent = program?.requirePaidEvent ?? false

  const usersById = useMemo(() => {
    const map = new Map()
    if (!Array.isArray(users)) return map

    users.forEach((user) => {
      if (user?._id) {
        map.set(String(user._id), user)
      }
    })

    return map
  }, [users])

  const eventsById = useMemo(() => {
    const map = new Map()
    if (Array.isArray(events)) {
      events.forEach((eventItem) => {
        if (eventItem?._id) {
          map.set(String(eventItem._id), eventItem)
        }
      })
    }

    return map
  }, [events])

  const referralsByReferrer = useMemo(() => {
    const map = new Map()
    if (!Array.isArray(users)) return map

    users.forEach((user) => {
      const referrerId = user?.referrerId
      if (!referrerId) return

      const key = String(referrerId)
      if (map.has(key)) {
        map.get(key).push(user)
      } else {
        map.set(key, [user])
      }
    })

    return map
  }, [users])

  const participantsByUser = useMemo(() => {
    const map = new Map()
    if (!Array.isArray(eventsUsers)) return map

    eventsUsers.forEach((eventUser) => {
      if (!eventUser?.userId) return
      if (['reserve', 'ban'].includes(eventUser.status)) return

      const userId = String(eventUser.userId)
      if (map.has(userId)) {
        map.get(userId).push(eventUser)
      } else {
        map.set(userId, [eventUser])
      }
    })

    return map
  }, [eventsUsers])

const conditionStatusByUser = useMemo(() => {
  const map = new Map()
  if (participantsByUser.size === 0) return map

  const pickLatestEventDetail = (existing, candidate) => {
    if (!candidate) return existing ?? null
    if (!existing) return candidate

    const existingTime =
      typeof existing.timestamp === 'number' ? existing.timestamp : 0
    const candidateTime =
      typeof candidate.timestamp === 'number' ? candidate.timestamp : 0

    return candidateTime >= existingTime ? candidate : existing
  }

  participantsByUser.forEach((userEvents, userId) => {
    let qualifyingEventDetail = null

    userEvents.forEach((eventUser) => {
      const event = eventsById.get(String(eventUser.eventId))
      if (!event || event.status !== 'closed') return

      if (requirePaidEvent) {
        const isPaidEvent =
          Array.isArray(event.subEvents) &&
          event.subEvents.some((subEvent) => Number(subEvent?.price ?? 0) > 0)
        if (!isPaidEvent) return
      }

      const rawDate =
        event?.dateStart ?? event?.date ?? eventUser?.createdAt ?? null
      const timestamp = rawDate ? new Date(rawDate).getTime() : 0

      const detail = {
        eventId: event?._id ? String(event._id) : String(eventUser.eventId),
        eventTitle: event?.title ?? null,
        eventDate: rawDate,
        timestamp,
      }

      qualifyingEventDetail = pickLatestEventDetail(
        qualifyingEventDetail,
        detail
      )
    })

    if (qualifyingEventDetail) {
      map.set(userId, { met: true, event: qualifyingEventDetail })
    } else {
      map.set(userId, { met: false, event: null })
    }
  })

  return map
}, [participantsByUser, eventsById, requirePaidEvent])

  const couponsByPair = useMemo(() => {
    const map = new Map()
    if (!Array.isArray(payments)) return map

    payments.forEach((payment) => {
      if (!payment?.isReferralCoupon) return

      const reward = payment?.referralReward ?? {}
      const referralUserId = reward?.referralUserId
      if (!referralUserId) return

      const referrerId = reward?.referrerId ?? payment?.userId ?? null
      const key = `${referrerId ? String(referrerId) : 'null'}|${String(
        referralUserId
      )}`

      const detail = {
        sum: typeof payment?.sum === 'number' ? payment.sum : null,
        payAt: payment?.payAt ?? null,
        rewardEventId:
          reward?.eventId != null ? String(reward.eventId) : null,
        usageEventId:
          payment?.eventId != null ? String(payment.eventId) : null,
        comment: payment?.comment ?? '',
      }

      const entry = map.get(key) ?? {
        referrer: { issued: null, used: null },
        referral: { issued: null, used: null },
      }

      if (reward?.rewardFor === 'referrer') {
        if (detail.usageEventId) {
          entry.referrer.used = pickLatestByDate(entry.referrer.used, detail)
        } else {
          entry.referrer.issued = pickLatestByDate(entry.referrer.issued, detail)
        }
      } else if (reward?.rewardFor === 'referral') {
        if (detail.usageEventId) {
          entry.referral.used = pickLatestByDate(entry.referral.used, detail)
        } else {
          entry.referral.issued = pickLatestByDate(entry.referral.issued, detail)
        }
      }

      map.set(key, entry)
    })

    return map
  }, [payments])

  const referrerEntries = useMemo(() => {
    const entries = []

    referralsByReferrer.forEach((referrals, referrerId) => {
      const sortedReferrals = [...referrals].sort((a, b) => {
        const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      })

      entries.push({
        referrerId,
        referrer: usersById.get(referrerId) ?? null,
        referrals: sortedReferrals,
      })
    })

    entries.sort((a, b) => {
      if (b.referrals.length !== a.referrals.length) {
        return b.referrals.length - a.referrals.length
      }

      const referrerA = a.referrer
      const referrerB = b.referrer
      const nameA = referrerA?.firstName ? referrerA.firstName : ''
      const nameB = referrerB?.firstName ? referrerB.firstName : ''
      return nameA.localeCompare(nameB, 'ru')
    })

    return entries
  }, [referralsByReferrer, usersById])

  const totals = useMemo(() => {
    let referralsCount = 0
    let conditionMetCount = 0

    referralsByReferrer.forEach((referrals) => {
      referralsCount += referrals.length

      referrals.forEach((referral) => {
        const referralId = referral?._id ? String(referral._id) : null
        if (!referralId) return

        const conditionStatus = conditionStatusByUser.get(referralId)
        const conditionMetByEvent = conditionStatus?.met === true

        if (conditionMetByEvent) {
          conditionMetCount += 1
        }
      })
    })

    return {
      referralsCount,
      conditionMetCount,
      referrerCount: referralsByReferrer.size,
    }
  }, [referralsByReferrer, conditionStatusByUser])

  const handleOpenReferralCards = useCallback(
    (referrals, startReferralId) => {
      if (!modalsFunc?.referral?.cardsView) return
      if (!Array.isArray(referrals) || referrals.length === 0) return

      modalsFunc.referral.cardsView({
        referrals,
        startUserId: startReferralId,
        title: 'Карточки рефералов',
      })
    },
    [modalsFunc]
  )

  const renderUserName = useCallback((user, fallback) => {
    if (user && typeof user === 'object') {
      return <UserName user={user} />
    }

    return <span className="text-sm text-gray-500">{fallback}</span>
  }, [])

  if (
    !Array.isArray(users) ||
    !Array.isArray(eventsUsers) ||
    !Array.isArray(payments)
  ) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner text="Загрузка данных о рефералах..." />
      </div>
    )
  }

  const conditionText = requirePaidEvent
    ? 'Посещение платного мероприятия'
    : 'Посещение любого мероприятия'

  return (
    <div className="flex flex-col px-1 pb-4 gap-y-4">
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="text-lg font-semibold text-general">
          Статус реферальной программы
        </div>
        <div className="mt-2 text-sm text-gray-700">
          Программа {programEnabled ? 'включена' : 'выключена'}.
        </div>
        <div className="mt-1 text-sm text-gray-700">
          Условие начисления купона: {conditionText}.
        </div>
        <div className="mt-1 text-sm text-gray-700">
          Купон реферера: {formatCurrencyValue(referrerCouponAmount)}.
        </div>
        <div className="mt-1 text-sm text-gray-700">
          Купон реферала: {formatCurrencyValue(referralCouponAmount)}.
        </div>
        {!programEnabled && (
          <Note className="mt-3" type="warning">
            Даже при выключенной программе вы можете просматривать накопленную
            статистику.
          </Note>
        )}
      </div>

      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="text-lg font-semibold text-general">Сводка</div>
        <div className="mt-2 text-sm text-gray-700">
          Рефереров: {totals.referrerCount}
        </div>
        <div className="mt-1 text-sm text-gray-700">
          Рефералов: {totals.referralsCount}
        </div>
        <div className="mt-1 text-sm text-gray-700">
          Выполнили условие: {totals.conditionMetCount}
        </div>
      </div>

      {referrerEntries.length === 0 ? (
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">
            Пользователи, указавшие реферера при регистрации, пока отсутствуют.
          </div>
        </div>
      ) : (
        referrerEntries.map(({ referrerId, referrer, referrals }) => {
          const referrerLabel = referrer
            ? renderUserName(referrer)
            : null

          return (
            <div
              key={referrerId}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex flex-col gap-1 phoneH:flex-row phoneH:items-center phoneH:justify-between">
                <div className="text-lg font-semibold text-general flex flex-wrap items-center gap-2">
                  <span>Реферер:</span>
                  {referrerLabel || (
                    <span className="text-sm text-gray-500">
                      Пользователь не найден (ID: {referrerId})
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-start gap-2 text-sm text-gray-600 phoneH:items-end">
                  <div>
                    {referrals.length}{' '}
                    {referrals.length === 1
                      ? 'реферал'
                      : referrals.length < 5
                      ? 'реферала'
                      : 'рефералов'}
                  </div>
                  <Button
                    name="Карточки"
                    className="w-full phoneH:w-auto"
                    outline
                    onClick={() => handleOpenReferralCards(referrals)}
                  />
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left border border-gray-200 divide-y divide-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-sm font-medium text-gray-600">
                        Реферал
                      </th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-600">
                        Дата регистрации
                      </th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-600">
                        Статус условия
                      </th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-600">
                        Купон реферера
                      </th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-600">
                        Купон реферала
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {referrals.map((referral) => {
                      const referralId = referral?._id ? String(referral._id) : null
                      if (!referralId) return null

                      const mapKey = `${referrerId}|${referralId}`
                      const coupons = couponsByPair.get(mapKey) ?? null
                      const referrerCoupon = coupons?.referrer ?? null
                      const referralCoupon = coupons?.referral ?? null

                      const conditionStatus =
                        conditionStatusByUser.get(referralId) ?? {
                          met: false,
                          event: null,
                        }
                      const conditionMet = conditionStatus.met === true
                      const visitedEvent = conditionStatus.event

                      const visitedEventDate = visitedEvent?.eventDate
                        ? formatDate(visitedEvent.eventDate)
                        : null

                      const conditionDescription = conditionMet
                        ? visitedEvent?.eventTitle
                          ? `Посещено мероприятие "${visitedEvent.eventTitle}"${
                              visitedEventDate ? ` ${visitedEventDate}` : ''
                            }`
                          : 'Посещено подходящее мероприятие'
                        : 'Посещений подходящих мероприятий пока нет'

                      const referrerCouponStatus = getCouponStatus(
                        referrerCoupon,
                        eventsById
                      )
                      const referralCouponStatus = getCouponStatus(
                        referralCoupon,
                        eventsById
                      )

                      const conditionIcon = conditionMet
                        ? faCheckCircle
                        : faTimesCircle

                      const conditionColor = conditionMet
                        ? 'text-success'
                        : 'text-danger'

                      const referrerCouponClass =
                        referrerCouponStatus.status === 'used'
                          ? 'text-success'
                          : referrerCouponStatus.status === 'issued'
                          ? 'text-general'
                          : 'text-gray-500'

                      const referralCouponClass =
                        referralCouponStatus.status === 'used'
                          ? 'text-success'
                          : referralCouponStatus.status === 'issued'
                          ? 'text-general'
                          : 'text-gray-500'

                      return (
                        <tr
                          key={referralId}
                          className="transition-colors cursor-pointer hover:bg-gray-50"
                          onClick={() =>
                            handleOpenReferralCards(referrals, referralId)
                          }
                        >
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {renderUserName(
                              referral,
                              `Пользователь не найден (ID: ${referralId})`
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {referral?.createdAt
                              ? formatDate(referral.createdAt)
                              : '—'}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            <div className="flex flex-col gap-1 leading-[14px] phoneH:leading-[18px]">
                              <div className="flex items-center gap-2">
                                <FontAwesomeIcon
                                  icon={conditionIcon}
                                  className={`h-5 w-5 flex-shrink-0 ${conditionColor}`}
                                />
                                <span>
                                  {conditionMet
                                    ? 'Условие посещения выполнено'
                                    : 'Условие посещения не выполнено'}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600">
                                {conditionDescription}
                              </div>
                            </div>
                          </td>
                          <td className={`px-4 py-2 text-sm ${referrerCouponClass}`}>
                            {referrerCouponStatus.text}
                          </td>
                          <td className={`px-4 py-2 text-sm ${referralCouponClass}`}>
                            {referralCouponStatus.text}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export default ReferralsAdminContent
