'use client'

import ContentHeader from '@components/ContentHeader'
import AddButton from '@components/IconToggleButtons/AddButton'
import { getNounReviews } from '@helpers/getNoun'
import ReviewCard from '@layouts/cards/ReviewCard'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import modalsFuncAtom from '@state/modalsFuncAtom'
import reviewsAtom from '@state/atoms/reviewsAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useAtomValue } from 'jotai'

const ReviewsContent = () => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const reviews = useAtomValue(reviewsAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const addButton = loggedUserActiveRole?.generalPage?.reviews

  return (
    <>
      <ContentHeader>
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounReviews(reviews.length)}
          </div>
          {addButton && <AddButton onClick={() => modalsFunc.review.edit()} />}
        </div>
      </ContentHeader>
      <CardListWrapper>
        {reviews?.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review._id} reviewId={review._id} />
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
