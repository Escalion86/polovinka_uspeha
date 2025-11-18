// import UserCard from '@layouts/cards/UserCard'
import dynamic from 'next/dynamic'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import { useAtomValue } from 'jotai'
import { useCallback, useMemo } from 'react'
import ListWrapper from './ListWrapper'

const NewsletterCard = dynamic(() => import('@layouts/cards/NewsletterCard'))

const NewslettersList = ({ newsletters }) => {
  const widthNum = useAtomValue(windowDimensionsNumSelector)
  const itemData = useMemo(() => newsletters ?? [], [newsletters])
  const itemKey = useCallback(
    (index, data) => data?.[index]?._id ?? index,
    []
  )
  const renderRow = useCallback(
    ({ index, style, data }) => (
      <NewsletterCard style={style} newsletterId={data[index]._id} />
    ),
    []
  )
  return (
    <ListWrapper
      itemCount={itemData.length}
      itemSize={widthNum > 2 ? 74 : 74}
      className="bg-general/15"
      itemData={itemData}
      itemKey={itemKey}
    >
      {renderRow}
    </ListWrapper>
  )
}

export default NewslettersList
