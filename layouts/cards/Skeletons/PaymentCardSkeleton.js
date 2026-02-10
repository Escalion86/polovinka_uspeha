import Skeleton from 'react-loading-skeleton'
import CardWrapper from '@components/CardWrapper'

const PaymentCardSkeleton = ({ hidden, style, loading }) => {
  return (
    <CardWrapper
      loading={loading}
      className="flex items-stretch h-14 tablet:h-16 rounded-[18px] border border-[rgba(107,31,42,0.18)] shadow-[0_10px_20px_rgba(0,0,0,0.08)]"
      bgClassName="bg-white/95"
      flex={false}
      hidden={hidden}
      style={style}
      gap={false}
    >
      <div className="flex items-center justify-center w-8 tablet:w-9 text-white bg-gray-300 rounded-l-[18px]">
        <Skeleton circle height={18} width={18} />
      </div>
      <div className="flex flex-1 items-center justify-between px-2 gap-x-2">
        <div className="flex flex-col flex-1 gap-y-1">
          <Skeleton height={12} width="60%" />
          <Skeleton height={12} width="45%" />
        </div>
        <div className="flex flex-col items-end gap-y-1">
          <Skeleton height={12} width={70} />
          <Skeleton height={16} width={80} />
        </div>
      </div>
    </CardWrapper>
  )
}

export default PaymentCardSkeleton
