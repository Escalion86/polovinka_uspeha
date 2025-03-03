// import UserCard from '@layouts/cards/UserCard'
import dynamic from 'next/dynamic'
const NewsletterCard = dynamic(() => import('@layouts/cards/NewsletterCard'))
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import { useAtomValue } from 'jotai'
import ListWrapper from './ListWrapper'

const NewslettersList = ({ newsletters }) => {
  const widthNum = useAtomValue(windowDimensionsNumSelector)
  return (
    <ListWrapper
      itemCount={newsletters?.length}
      itemSize={widthNum > 2 ? 52 : 52}
      className="bg-general/15"
    >
      {({ index, style }) => (
        <NewsletterCard
          style={style}
          key={newsletters[index]._id}
          newsletterId={newsletters[index]._id}
        />
      )}
    </ListWrapper>
  )
}

export default NewslettersList
