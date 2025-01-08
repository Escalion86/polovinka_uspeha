// import PaymentCard from '@layouts/cards/PaymentCard'
import dynamic from 'next/dynamic'
const PaymentCard = dynamic(() => import('@layouts/cards/PaymentCard'))
import windowDimensionsNumSelector from '@state/jotai/selectors/windowDimensionsNumSelector'
import { useAtomValue } from 'jotai'
import ListWrapper from './ListWrapper'

const PaymentsList = ({ payments }) => {
  const widthNum = useRecoilValue(windowDimensionsNumSelector)
  return (
    <ListWrapper
      itemCount={payments.length}
      itemSize={widthNum > 2 ? 68 : 60}
      className="bg-general/15"
    >
      {({ index, style }) => (
        <PaymentCard
          style={style}
          key={payments[index]._id}
          paymentId={payments[index]._id}
        />
      )}
    </ListWrapper>
  )
}

export default PaymentsList
