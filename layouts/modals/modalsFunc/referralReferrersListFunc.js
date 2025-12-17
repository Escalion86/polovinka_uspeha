import Button from '@components/Button'
import UserName from '@components/UserName'
import formatDate from '@helpers/formatDate'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const referralReferrersListFunc = ({
  referrerEntries = [],
  couponsByPair = new Map(),
  conditionStatusByUser = new Map(),
  eventsById = new Map(),
  renderUserName,
  onOpenReferralCards,
}) => {
  const getCouponStatus = (coupon) => {
    if (!coupon) {
      return { text: 'Купон не начислен', status: 'missing' }
    }

    const { issued = null, used = null } = coupon
    const amount = used?.sum ?? issued?.sum ?? null
    const amountText =
      typeof amount === 'number'
        ? `${(amount / 100).toLocaleString('ru-RU', {
            minimumFractionDigits: amount % 100 !== 0 ? 2 : 0,
            maximumFractionDigits: amount % 100 !== 0 ? 2 : 0,
          })} ₽`
        : null

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

  const renderUser = (user, fallback) => {
    if (typeof renderUserName === 'function') {
      return renderUserName(user, fallback)
    }

    if (user && typeof user === 'object') {
      return <UserName user={user} />
    }

    return <span className="text-sm text-gray-500">{fallback}</span>
  }

  const ReferrerListContent = () => {
    if (referrerEntries.length === 0) {
      return (
        <div className="text-sm text-gray-600">
          Пользователи, указавшие реферера при регистрации, пока отсутствуют.
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-4">
        {referrerEntries.map(({ referrerId, referrer, referrals }) => {
          const referrerLabel = referrer ? renderUser(referrer) : null

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
                    onClick={() =>
                      typeof onOpenReferralCards === 'function'
                        ? onOpenReferralCards(referrals)
                        : undefined
                    }
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

                      const referrerCouponStatus = getCouponStatus(referrerCoupon)
                      const referralCouponStatus = getCouponStatus(referralCoupon)

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
                            typeof onOpenReferralCards === 'function'
                              ? onOpenReferralCards(referrals, referralId)
                              : undefined
                          }
                        >
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {renderUser(
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
        })}
      </div>
    )
  }

  return {
    title: 'Рефереры и их рефералы',
    declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: ReferrerListContent,
  }
}

export default referralReferrersListFunc
