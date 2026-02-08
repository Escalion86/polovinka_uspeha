'use client'

import ContentHeader from '@components/ContentHeader'
import AddButton from '@components/IconToggleButtons/AddButton'
import { getNounReviews } from '@helpers/getNoun'
import ReviewCard from '@layouts/cards/ReviewCard'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import modalsFuncAtom from '@state/modalsFuncAtom'
import reviewsAtom from '@state/atoms/reviewsAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import itemsFuncAtom from '@state/itemsFuncAtom'
import snackbarAtom from '@state/atoms/snackbarAtom'
import { useAtomValue } from 'jotai'
import { useCallback, useMemo } from 'react'

const ReviewsContent = () => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const reviews = useAtomValue(reviewsAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const itemFunc = useAtomValue(itemsFuncAtom)
  const snackbar = useAtomValue(snackbarAtom)
  const addButton = loggedUserActiveRole?.generalPage?.reviews
  const canEdit = loggedUserActiveRole?.generalPage?.reviews

  const orderedReviews = useMemo(() => {
    return [...(reviews ?? [])]
      .map((review, index) => ({
        ...review,
        index: typeof review?.index === 'number' ? review.index : index,
      }))
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
  }, [reviews])

  const moveReview = useCallback(
    async (review, direction) => {
      if (!review) return
      const index = orderedReviews.findIndex(
        (item) => item._id === review._id
      )
      const newIndex = index + direction
      if (index < 0 || newIndex < 0 || newIndex >= orderedReviews.length) return

      const current = orderedReviews[index]
      const target = orderedReviews[newIndex]
      const currentIndexValue =
        typeof current.index === 'number' ? current.index : index
      const targetIndexValue =
        typeof target.index === 'number' ? target.index : newIndex

      const result = await Promise.all([
        itemFunc.review.set(
          { _id: current._id, index: targetIndexValue },
          false,
          true
        ),
        itemFunc.review.set(
          { _id: target._id, index: currentIndexValue },
          false,
          true
        ),
      ])

      if (result.filter(Boolean).length === 2) {
        snackbar.success('Отзыв перемещён')
      } else {
        snackbar.error('Не удалось переместить отзыв')
      }
    },
    [itemFunc.review, orderedReviews, snackbar]
  )

  return (
    <>
      <ContentHeader>
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounReviews(orderedReviews.length)}
          </div>
          {addButton && <AddButton onClick={() => modalsFunc.review.edit()} />}
        </div>
      </ContentHeader>
      <CardListWrapper>
        {orderedReviews.length > 0 ? (
          orderedReviews.map((review, index) => (
            <ReviewCard
              key={review._id}
              reviewId={review._id}
              onMoveUp={
                canEdit && index > 0
                  ? () => moveReview(review, -1)
                  : undefined
              }
              onMoveDown={
                canEdit && index < orderedReviews.length - 1
                  ? () => moveReview(review, 1)
                  : undefined
              }
            />
          ))
        ) : (
          <div className="flex justify-center p-2">Нет отзывов</div>
        )}
        {/* <Fab onClick={() => modalsFunc.review.edit()} show /> */}
      </CardListWrapper>
    </>
  )
}

export default ReviewsContent
