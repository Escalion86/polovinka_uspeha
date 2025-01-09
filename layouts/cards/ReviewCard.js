import CardButtons from '@components/CardButtons'
import { CardWrapper } from '@components/CardWrapper'
import { getNounAges } from '@helpers/getNoun'
import modalsFuncAtom from '@state/atoms/modalsFuncAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
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
      <div className="flex">
        <div
          className={cn(
            'flex-1 pr-2 py-1 text-xl font-bold',
            review.showOnSite ? 'pl-2' : 'pl-12 laptop:pl-2'
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
      <div className="px-2 py-1">{review.review}</div>
    </CardWrapper>
  )
}

export default ReviewCard
