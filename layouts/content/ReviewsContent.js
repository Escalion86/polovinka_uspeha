import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import getNoun from '@helpers/getNoun'
import Fab from '@components/Fab'
import CardButtons from '@components/CardButtons'

const ReviewsContent = (props) => {
  const { reviews } = props
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  return (
    <>
      {reviews?.length > 0 ? (
        reviews.map((review) => (
          <div
            key={review._id}
            className="duration-300 bg-white border-t border-b border-gray-400 shadow-sm cursor-pointer hover:shadow-medium-active"
            onClick={() => modalsFunc.review.edit(review)}
          >
            <div className="flex">
              <div className="flex-1 px-2 py-1 text-xl font-bold">
                {review.author}
                {review.authorAge
                  ? ', ' + getNoun(review.authorAge, 'год', 'года', 'лет')
                  : ''}
              </div>
              <CardButtons item={review} typeOfItem="review" />
            </div>
            <div className="px-2 py-1">{review.review}</div>
          </div>
        ))
      ) : (
        <div className="flex justify-center p-2">Нет отзывов</div>
      )}
      <Fab onClick={() => modalsFunc.review.edit()} show />
    </>
  )
}

export default ReviewsContent
