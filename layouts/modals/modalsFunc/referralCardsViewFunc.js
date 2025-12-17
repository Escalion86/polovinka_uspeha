import Button from '@components/Button'
import UserCard from '@layouts/cards/UserCard'
import { useCallback, useEffect, useMemo, useState } from 'react'

const referralCardsViewFunc = ({ referrals = [], startUserId = null, title }) => {
  const ReferralCardsViewModal = () => {
    const referralIds = useMemo(
      () =>
        referrals
          .map((referral) => referral?._id)
          .filter((referralId) => typeof referralId === 'string' && referralId.trim().length > 0),
      [referrals]
    )

    const fallbackIndex = referralIds.length > 0 ? 0 : -1
    const startIndex = useMemo(() => {
      if (!startUserId) return fallbackIndex

      const normalizedId = String(startUserId)
      const foundIndex = referralIds.findIndex((id) => id === normalizedId)
      return foundIndex >= 0 ? foundIndex : fallbackIndex
    }, [fallbackIndex, referralIds, startUserId])

    const [currentIndex, setCurrentIndex] = useState(startIndex)

    useEffect(() => {
      setCurrentIndex(startIndex)
    }, [startIndex])

    const hasMultiple = referralIds.length > 1
    const currentUserId = currentIndex >= 0 ? referralIds[currentIndex] : null

    const goPrev = useCallback(() => {
      if (!hasMultiple) return
      setCurrentIndex((prev) => (prev - 1 + referralIds.length) % referralIds.length)
    }, [hasMultiple, referralIds.length])

    const goNext = useCallback(() => {
      if (!hasMultiple) return
      setCurrentIndex((prev) => (prev + 1) % referralIds.length)
    }, [hasMultiple, referralIds.length])

    if (referralIds.length === 0) {
      return <div className="text-center text-gray-600">Рефералы не найдены</div>
    }

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 phoneH:flex-row phoneH:items-center phoneH:justify-between">
          <div className="text-sm text-gray-600">
            Карточка {currentIndex + 1} из {referralIds.length}
          </div>
          {hasMultiple && (
            <div className="flex flex-wrap gap-2">
              <Button name="Предыдущий" onClick={goPrev} outline />
              <Button name="Следующий" onClick={goNext} outline />
            </div>
          )}
        </div>

        {currentUserId ? (
          <UserCard userId={currentUserId} />
        ) : (
          <div className="text-center text-gray-600">Данные пользователя недоступны</div>
        )}
      </div>
    )
  }

  return {
    title: title ?? 'Карточки рефералов',
    declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: ReferralCardsViewModal,
  }
}

export default referralCardsViewFunc
