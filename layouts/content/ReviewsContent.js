import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import getNoun from '@helpers/getNoun'

const ReviewsContent = ({ user, events, directions, reviews }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  return (
    // <div className="flex flex-col w-full h-full py-1 bg-opacity-15 gap-y-2 bg-general">
    reviews ? (
      reviews.map((review) => (
        <div
          key={review._id}
          className="px-2 py-1 duration-300 bg-white border-t border-b border-gray-400 shadow-sm cursor-pointer hover:shadow-medium-active"
          onClick={() => modalsFunc.review(review)}
        >
          <div className="text-xl font-bold">
            {review.author}
            {review.authorAge
              ? ', ' + getNoun(review.authorAge, 'год', 'года', 'лет')
              : ''}
          </div>
          <div>{review.review}</div>
        </div>
      ))
    ) : (
      <div className="flex justify-center p-2">Нет отзывов</div>
    )
  )
}

export default ReviewsContent
