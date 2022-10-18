import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import { getNounReviews } from '@helpers/getNoun'
// import Fab from '@components/Fab'
import reviewsAtom from '@state/atoms/reviewsAtom'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import AddButton from '@components/IconToggleButtons/AddButton'
import ContentHeader from '@components/ContentHeader'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import ReviewCard from '@layouts/cards/ReviewCard'

const ReviewsContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const reviews = useRecoilValue(reviewsAtom)
  const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)

  return (
    <>
      <ContentHeader>
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounReviews(reviews.length)}
          </div>
          {isLoggedUserAdmin && (
            <AddButton onClick={() => modalsFunc.review.edit()} />
          )}
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
