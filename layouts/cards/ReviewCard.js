import CardButtons from '@components/CardButtons'
import CardWrapper from '@components/CardWrapper'
import { getNounAges } from '@helpers/getNoun'
import modalsFuncAtom from '@state/modalsFuncAtom'
import itemsFuncAtom from '@state/itemsFuncAtom'
import loadingAtom from '@state/atoms/loadingAtom'
import reviewSelector from '@state/selectors/reviewSelector'
import cn from 'classnames'
import { useAtomValue } from 'jotai'

const ReviewCard = ({ reviewId, hidden = false, style }) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const review = useAtomValue(reviewSelector(reviewId))
  const loading = useAtomValue(loadingAtom('review' + reviewId))
  const itemFunc = useAtomValue(itemsFuncAtom)

  return (
    <CardWrapper
      loading={loading}
      onClick={() => modalsFunc.review.edit(review._id)}
      flex={false}
      showOnSite={review.showOnSite}
      hidden={hidden}
      style={style}
    >
      <div className="flex items-center gap-3 px-2 py-2">
        <img
          src={review.image || '/img/users/null.jpg'}
          alt={review.author}
          className="h-16 w-16 rounded-full border-2 border-[#4fb0e8] object-cover"
        />
        <div
          className={cn(
            'flex-1 pr-2 text-xl font-bold',
            review.showOnSite ? '' : 'pl-10 laptop:pl-0'
          )}
        >
          {review.author}
          {review.authorAge ? ', ' + getNounAges(review.authorAge) : ''}
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
      <div className="px-2 pb-3 whitespace-pre-line">{review.review}</div>
    </CardWrapper>
  )
}

export default ReviewCard
