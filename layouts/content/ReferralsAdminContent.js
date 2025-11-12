'use client'

import LoadingSpinner from '@components/LoadingSpinner'
import Note from '@components/Note'
import UserName from '@components/UserName'
import formatDate from '@helpers/formatDate'
import useReferralsAdminSummary from '@helpers/useReferralsAdminSummary'
import modalsFuncAtom from '@state/modalsFuncAtom'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAtomValue } from 'jotai'
import { useCallback, useMemo } from 'react'

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
  const {
    referrers,
    referralProgram,
    totals,
    events,
    isLoading,
    error,
  } = useReferralsAdminSummary()
  const modalsFunc = useAtomValue(modalsFuncAtom)

  const program = referralProgram ?? {}
  const programEnabled = getProgramEnabled(program)
  const referrerCouponAmount = program?.referrerCouponAmount ?? 0
  const referralCouponAmount = program?.referralCouponAmount ?? 0
  const requirePaidEvent = program?.requirePaidEvent ?? false

  const eventsById = useMemo(() => {
    const map = new Map()
    events.forEach((eventItem) => {
      if (eventItem?._id) {
        map.set(String(eventItem._id), eventItem)
      }
    })
    return map
  }, [events])

  const handleOpenUser = useCallback(
    (userId) => {
      if (userId && modalsFunc?.user?.view) {
        modalsFunc.user.view(userId)
      }
    },
    [modalsFunc]
  )

  const renderUserName = useCallback((user, fallback) => {
    if (user && typeof user === 'object') {
      return <UserName user={user} />
    }

    return <span className="text-sm text-gray-500">{fallback}</span>
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner text="Загрузка данных о рефералах..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Note type="danger">
          Не удалось загрузить статистику по рефералам. Попробуйте обновить
          страницу.
        </Note>
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

      {referrers.length === 0 ? (
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">
            Пользователи, указавшие реферера при регистрации, пока отсутствуют.
          </div>
        </div>
      ) : (
        referrers.map(({ referrerId, referrer, referrals }) => {
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
                <div className="text-sm text-gray-600">
                  {referrals.length}{' '}
                  {referrals.length === 1
                    ? 'реферал'
                    : referrals.length < 5
                    ? 'реферала'
                    : 'рефералов'}
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
                      const referralUser = referral?.user ?? null
                      const referralId = referralUser?._id
                        ? String(referralUser._id)
                        : null
                      if (!referralId) return null

                      const coupons = referral?.coupons ?? null
                      const referrerCoupon = coupons?.referrer ?? null
                      const referralCoupon = coupons?.referral ?? null

                      const condition = referral?.condition ?? {
                        met: false,
                        event: null,
                      }
                      const conditionMet = condition.met === true
                      const visitedEvent = condition.event

                      const visitedEventDate = visitedEvent?.dateStart
                        ? formatDate(visitedEvent.dateStart)
                        : visitedEvent?.date
                        ? formatDate(visitedEvent.date)
                        : null

                      const conditionDescription = conditionMet
                        ? visitedEvent?.title
                          ? `Посещено мероприятие "${visitedEvent.title}"${
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
                          onClick={() => handleOpenUser(referralId)}
                        >
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {renderUserName(
                              referralUser,
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
