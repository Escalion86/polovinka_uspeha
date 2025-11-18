// import UserCard from '@layouts/cards/UserCard'
import dynamic from 'next/dynamic'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import ListWrapper from './ListWrapper'

const NewsletterCard = dynamic(() => import('@layouts/cards/NewsletterCard'))

const NewslettersList = ({ newsletters }) => {
  const widthNum = useAtomValue(windowDimensionsNumSelector)
  const itemData = useMemo(() => newsletters ?? [], [newsletters])
  const renderCountRef = useRef(0)
  const prevDataRef = useRef()
  const debugNewsletters =
    process.env.NEXT_PUBLIC_DEBUG_NEWSLETTERS === 'true'
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

  useEffect(() => {
    if (!debugNewsletters) return
    renderCountRef.current += 1
    console.debug('[NewslettersList] render', {
      time: new Date().toISOString(),
      renderCount: renderCountRef.current,
      itemCount: itemData.length,
      firstId: itemData[0]?._id,
    })
  })

  useEffect(() => {
    if (!debugNewsletters) return
    const prev = prevDataRef.current
    prevDataRef.current = itemData
    console.debug('[NewslettersList] изменились входные данные', {
      time: new Date().toISOString(),
      prevLength: prev?.length ?? 0,
      nextLength: itemData.length,
      prevFirstId: prev?.[0]?._id,
      nextFirstId: itemData?.[0]?._id,
    })
  }, [debugNewsletters, itemData])
  return (
    <ListWrapper
      itemCount={itemData.length}
      itemSize={widthNum > 2 ? 74 : 74}
      className="bg-general/15"
      itemData={itemData}
      itemKey={itemKey}
      debugName="NewslettersList"
    >
      {renderRow}
    </ListWrapper>
  )
}

export default NewslettersList
