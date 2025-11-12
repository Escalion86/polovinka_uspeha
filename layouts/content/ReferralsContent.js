'use client'

import Button from '@components/Button'
import LoadingSpinner from '@components/LoadingSpinner'
import Note from '@components/Note'
import UserName from '@components/UserName'
import formatDate from '@helpers/formatDate'
import useSnackbar from '@helpers/useSnackbar'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import locationAtom from '@state/atoms/locationAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import useReferralsSummary from '@helpers/useReferralsSummary'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle'

const ReferralsContent = () => {
  const loggedUser = useAtomValue(loggedUserActiveAtom)
  const location = useAtomValue(locationAtom)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const { success, error } = useSnackbar()

  const [origin, setOrigin] = useState('')

  const loggedUserId = loggedUser?._id ? String(loggedUser._id) : null

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin)
    }
  }, [])

  const referralPath = useMemo(() => {
    if (!loggedUserId || !location) return ''
    return `/${location}/login?registration=true&ref=${loggedUserId}`
  }, [loggedUserId, location])

  const referralLink = useMemo(() => {
    if (!referralPath) return ''
    return origin ? `${origin}${referralPath}` : referralPath
  }, [origin, referralPath])

  const {
    referrals: referralEntries,
    referralProgram,
    isLoading: isSummaryLoading,
    error: referralsError,
  } = useReferralsSummary(loggedUserId)

  const program = referralProgram ?? {}
  const referrerCouponAmount = program.referrerCouponAmount ?? 0
  const referralCouponAmount = program.referralCouponAmount ?? 0

  const formatCurrency = useCallback((amount) => {
    if (typeof amount !== 'number') return '—'
    const hasFraction = amount % 100 !== 0
    return `${(amount / 100).toLocaleString('ru-RU', {
      minimumFractionDigits: hasFraction ? 2 : 0,
      maximumFractionDigits: hasFraction ? 2 : 0,
    })} ₽`
  }, [])

  const requirePaidEvent = program.requirePaidEvent ?? false

  const referralRewardsNote = useMemo(() => {
    const parts = []

    if (referrerCouponAmount > 0) {
      parts.push(
        `За каждого приглашённого вы получите ${formatCurrency(referrerCouponAmount)}.`
      )
    }

    if (referralCouponAmount > 0) {
      parts.push(
        `При регистрации по вашей ссылке приглашённый получит ${formatCurrency(referralCouponAmount)}.`
      )
    }

    return parts.join(' ')
  }, [referrerCouponAmount, referralCouponAmount, formatCurrency])

  const conditionText = useMemo(
    () =>
      requirePaidEvent
        ? 'Посещение платного мероприятия'
        : 'Посещение любого мероприятия',
    [requirePaidEvent]
  )

  const sortedReferrals = useMemo(() => {
    if (!Array.isArray(referralEntries)) return []
    return [...referralEntries].sort((a, b) => {
      const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })
  }, [referralEntries])

  const handleCopy = useCallback(async () => {
    if (!referralLink) return

    try {
      await navigator.clipboard.writeText(referralLink)
      success('Реферальная ссылка скопирована в буфер обмена')
    } catch (copyError) {
      error('Не удалось автоматически скопировать ссылку')
    }
  }, [referralLink, success, error])

  const handleQrCode = useCallback(() => {
    if (!referralLink || !modalsFunc?.external?.qrCodeGenerator) return

    modalsFunc.external.qrCodeGenerator({
      title: 'QR-код реферальной ссылки',
      link: referralLink,
    })
  }, [modalsFunc, referralLink])

  const handleOpenReferral = useCallback(
    (userId) => {
      if (userId && modalsFunc?.user?.view) return modalsFunc.user.view(userId)
    },
    [modalsFunc]
  )

  if (!loggedUser?._id) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner text="Загрузка профиля..." />
      </div>
    )
  }

  if (isSummaryLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner text="Загрузка данных по рефералам..." />
      </div>
    )
  }

  if (referralsError) {
    return (
      <div className="flex items-center justify-center h-full px-4">
        <Note>
          Не удалось загрузить данные реферальной программы. Попробуйте
          обновить страницу.
        </Note>
      </div>
    )
  }

  return (
    <div className="flex flex-col px-1 pb-4 gap-y-4">
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="text-lg font-semibold text-general">
          Ваша реферальная ссылка
        </div>
        <div className="mt-2 text-sm text-gray-700 break-all">
          {referralLink || 'Ссылка появится после загрузки данных пользователя'}
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <Button
            name="Скопировать ссылку"
            onClick={handleCopy}
            disabled={!referralLink}
          />
          <Button
            name="QR код"
            outline
            classOutlineColor="border-general"
            classOutlineTextColor="text-general"
            classHoverOutlineColor="hover:border-general"
            classHoverOutlineTextColor="hover:text-general"
            onClick={handleQrCode}
            disabled={!referralLink}
          />
        </div>
        <Note className="mt-3">
          Поделитесь этой ссылкой с друзьями. После регистрации по ней вы
          увидите их в списке своих рефералов.
        </Note>
      </div>

      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="text-lg font-semibold text-general">
          Условия программы
        </div>
        <div className="mt-2 text-sm text-gray-700">
          Условие для получения купона: {conditionText}.
        </div>
        <div className="mt-1 text-sm text-gray-700">
          Купон для реферала: {formatCurrency(referralCouponAmount)}.
        </div>
        <div className="mt-1 text-sm text-gray-700">
          Купон для реферера: {formatCurrency(referrerCouponAmount)}.
        </div>
        {referralRewardsNote && (
          <Note className="mt-3">{referralRewardsNote}</Note>
        )}
      </div>

      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-general">Мои рефералы</div>
          <div className="text-sm text-gray-600">
            {sortedReferrals.length}{' '}
            {sortedReferrals.length === 1
              ? 'приглашенный пользователь'
              : 'приглашенных пользователей'}
          </div>
        </div>
        {sortedReferrals.length === 0 ? (
          <div className="mt-4 text-gray-600">
            Пока нет пользователей, зарегистрировавшихся по вашей ссылке.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left border border-gray-200 divide-y divide-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-sm font-medium text-gray-600">
                    Имя
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-600">
                    Дата регистрации
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-600">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedReferrals.map((referral) => {
                  const issuedCoupon = referral?.coupon?.issued ?? null
                  const usedCoupon = referral?.coupon?.used ?? null
                  const couponSum =
                    typeof usedCoupon?.sum === 'number'
                      ? usedCoupon.sum
                      : typeof issuedCoupon?.sum === 'number'
                        ? issuedCoupon.sum
                        : null
                  const rewardSumText =
                    typeof couponSum === 'number'
                      ? formatCurrency(couponSum)
                      : null
                  const conditionMet = referral?.conditionMet ?? false
                  const rewardAmountText = rewardSumText
                    ? rewardSumText
                        .replace('₽', 'руб')
                        .replace(/\s+руб/, ' руб')
                        .trim()
                    : null
                  const usageEvent = usedCoupon?.usageEvent ?? null
                  const usageEventDate = usageEvent?.dateStart
                    ? formatDate(usageEvent.dateStart)
                    : usageEvent?.date
                      ? formatDate(usageEvent.date)
                      : usedCoupon?.payAt
                        ? formatDate(usedCoupon.payAt)
                        : null
                  const rewardStatusText =
                    usedCoupon && rewardAmountText
                      ? `Купон ${rewardAmountText} получен и использован на мероприятии "${
                          usageEvent?.title ?? '—'
                        }"${usageEventDate ? ` ${usageEventDate}` : ''}`
                      : issuedCoupon && rewardAmountText
                        ? `Купон ${rewardAmountText} получен`
                        : null

                  return (
                    <tr
                      key={referral._id}
                      className="transition-colors cursor-pointer hover:bg-gray-50"
                      onClick={() => handleOpenReferral(referral._id)}
                    >
                      <td className="px-4 py-2 text-sm text-gray-700">
                        <UserName user={referral} />
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {referral.createdAt ? formatDate(referral.createdAt) : '—'}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        <div className="flex flex-col gap-1 leading-[14px] phoneH:leading-[18px]">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon
                              icon={
                                conditionMet ? faCheckCircle : faTimesCircle
                              }
                              className={`h-5 w-5 flex-shrink-0 ${
                                conditionMet ? 'text-success' : 'text-danger'
                              }`}
                            />
                            <span>
                              {conditionMet
                                ? 'Условие выполнено'
                                : 'Условие не выполнено'}
                            </span>
                          </div>
                          <div>{rewardStatusText}</div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReferralsContent
