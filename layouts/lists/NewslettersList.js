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
      itemSize={widthNum > 2 ? 77 : 77}
      className="bg-general/15"
      itemData={newsletters}
      itemKey={(index, data) => data?.[index]?._id ?? index}
    >
      {({ index, style, data }) => (
        <NewsletterCard style={style} newsletter={data[index]} />
      )}
    </ListWrapper>
  )
}

export default NewslettersList
