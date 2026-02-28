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
      outerClassName="px-3 py-2"
    >
      <div className="flex items-center justify-center w-8 tablet:w-9 text-white bg-gray-300 rounded-l-[18px]">
        <Skeleton circle height={18} width={18} />
      </div>
      <div className="flex flex-1">
        <div className="flex flex-col items-start flex-1 h-full pr-1 ml-1 text-sm leading-4 justify-evenly gap-y-1">
          <Skeleton height={14} width="56%" />
          <Skeleton height={14} width="72%" />
          <Skeleton height={14} width="48%" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <Skeleton circle height={16} width={16} />
          </div>
          <div className="flex flex-col items-end">
            <Skeleton height={12} width={76} />
            <div className="flex items-center justify-between gap-x-1">
              <Skeleton height={18} width={58} />
              <Skeleton circle height={16} width={16} />
            </div>
          </div>
          <div className="mx-1">
            <Skeleton height={22} width={22} />
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}

export default PaymentCardSkeleton
