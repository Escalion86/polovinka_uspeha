import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import getNoun from '@helpers/getNoun'
import Fab from '@components/Fab'
import CardButtons from '@components/CardButtons'
import reviewsAtom from '@state/atoms/reviewsAtom'
import reviewSelector from '@state/selectors/reviewSelector'
import loadingAtom from '@state/atoms/loadingAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import { CardWrapper } from '@components/CardWrapper'

const ReviewCard = ({ reviewId }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const review = useRecoilValue(reviewSelector(reviewId))
  const loading = useRecoilValue(loadingAtom('review' + reviewId))
  const itemFunc = useRecoilValue(itemsFuncAtom)

  return (
    <CardWrapper
      loading={loading}
      onClick={() => modalsFunc.review.edit(review)}
      flex={false}
    >
      <div className="flex">
        <div className="flex-1 px-2 py-1 text-xl font-bold">
          {review.author}
          {review.authorAge
            ? ', ' + getNoun(review.authorAge, 'год', 'года', 'лет')
            : ''}
        </div>
        <CardButtons
          item={review}
          typeOfItem="review"
          showOnSiteOnClick={() => {
            itemFunc.review.set({
              _id: review._id,
              showOnSite: !review.showOnSite,
            })
          }}
        />
      </div>
      <div className="px-2 py-1">{review.review}</div>
    </CardWrapper>
  )
}

const ReviewsContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const reviews = useRecoilValue(reviewsAtom)
  return (
    <>
      {reviews?.length > 0 ? (
        reviews.map((review) => (
          <ReviewCard key={review._id} reviewId={review._id} />
        ))
      ) : (
        <div className="flex justify-center p-2">Нет отзывов</div>
      )}
      <Fab onClick={() => modalsFunc.review.edit()} show />
    </>
  )
}

export default ReviewsContent
