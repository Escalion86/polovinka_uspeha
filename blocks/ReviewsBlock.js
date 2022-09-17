import BlockContainer from '@components/BlockContainer'
import Masonry from '@components/Masonry'
import { H2, H3 } from '@components/tags'
import filteredReviewsSelector from '@state/selectors/filteredReviewsSelector'
import { useRecoilValue } from 'recoil'

const Review = ({ review, style }) => (
  <div className="p-3 bg-white rounded-lg" style={style}>
    <div className="font-bold">
      {review.author}
      {review.authorAge ? ', ' + review.authorAge : ''}
    </div>
    <div className="">{review.review}</div>
  </div>
)

const ReviewsBlock = () => {
  const filteredReviews = useRecoilValue(filteredReviewsSelector)
  if (!filteredReviews || filteredReviews.length === 0) return null
  return (
    <BlockContainer
      id="reviews"
      style={{
        backgroundImage: `url("/img/bg.webp")`,
        backgroundRepeat: 'no-repeat',
        // backgroundPosition: 'top 48px right',
        backgroundSize: 'cover',
      }}
      title="Отзывы"
    >
      <Masonry gap={16}>
        {filteredReviews.map((review, index) => (
          <Review key={review._id} review={review} />
        ))}
      </Masonry>
    </BlockContainer>
  )
}

export default ReviewsBlock
