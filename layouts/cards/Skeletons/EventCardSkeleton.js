import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import Skeleton from 'react-loading-skeleton'
import { useAtomValue } from 'jotai'
import cn from 'classnames'
import { CardWrapper } from '@components/CardWrapper'

const EventCardSkeleton = ({
  loading,
  hidden,
  style,
  noButtons,
  changeStyle = 'laptop',
}) => {
  const widthNum = useAtomValue(windowDimensionsNumSelector)

  return (
    <CardWrapper
      loading={loading}
      showOnSite={true}
      gap={false}
      hidden={hidden}
      style={style}
    >
      <div
        className={cn(
          'hidden relative justify-center w-40 h-40 max-h-40',
          changeStyle === 'laptop' ? 'laptop:flex' : 'desktop:flex',
          { 'laptop:w-auto': noButtons }
        )}
      >
        <Skeleton
          count={1}
          height="100%"
          borderRadius={0}
          containerClassName="-mt-[3px] min-w-[120px] laptop:min-h-[99%] h-[99%] laptop:min-w-[160px]"
        />
      </div>
      <div className="relative flex flex-col justify-between flex-1 w-full">
        <div className="flex flex-col flex-1">
          <div className="flex px-2">
            <div className="flex items-center justify-between flex-1 h-[36px] gap-x-1">
              <Skeleton
                count={1}
                height={28}
                containerClassName="flex-1 max-w-[200px]"
              />
              <Skeleton count={1} height={28} containerClassName="w-12" />
            </div>
          </div>
          <div className="flex flex-1 min-h-[32px] h-[32px]">
            <div className="flex flex-col flex-1 laptop:flex-row">
              <div className="flex items-center justify-center flex-1 gap-2 px-2">
                <div
                  className={cn(
                    'flex min-h-[64px] flex-col items-center justify-center flex-1',
                    changeStyle === 'laptop'
                      ? 'laptop:min-h-[40px]'
                      : 'desktop:min-h-[40px]'
                  )}
                >
                  <Skeleton
                    count={1}
                    height={18}
                    containerClassName={cn(
                      'w-[80%] py-1 h-[28px]',
                      changeStyle === 'laptop'
                        ? 'laptop:hidden'
                        : 'desktop:hidden'
                    )}
                  />
                  <div className="flex items-center h-[36px] w-full justify-center">
                    <Skeleton
                      count={1}
                      height={18}
                      containerClassName="w-[80%]"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <Skeleton
                    count={1}
                    height={28}
                    containerClassName="hidden w-16 tablet:block h-7"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full">
          <div className="flex items-center justify-center tablet:h-[24.8px] w-full px-2 pt-1 pb-1 mt-1 border-t">
            <Skeleton
              count={1}
              // height={widthNum >= 2 ? 16 : 28}
              containerClassName="min-w-[150px] w-[150px] tablet:w-[300px]"
              className="h-[28px] tablet:h-[16px]"
            />
          </div>
        </div>

        {widthNum >= 3 && (
          <div className="max-h-[42px]">
            <div className="flex items-center justify-between px-2 pb-1 border-t">
              <div className="flex justify-between gap-x-4 items-center border-t h-[38px]">
                <Skeleton count={1} height={28} containerClassName="w-16" />
                <Skeleton count={1} height={28} containerClassName="w-16" />
                <Skeleton count={1} height={28} containerClassName="w-16" />
              </div>
              <Skeleton count={1} height={28} containerClassName="w-20" />
            </div>
          </div>
        )}
      </div>
      {widthNum <= 2 && (
        <div className="flex flex-wrap justify-end flex-1 w-full">
          {/* EventUsersCounterAndAge */}
          <div className="px-2 flex justify-between items-center border-t border-b h-[38px] laptop:h-[42px] flex-1 min-w-full">
            <Skeleton count={1} height={28} containerClassName="w-18" />
            <Skeleton count={1} height={28} containerClassName="w-18" />
            <Skeleton count={1} height={28} containerClassName="w-18" />
          </div>

          <div className="flex items-center justify-between flex-1 w-full px-2 pb-1 h-9">
            <Skeleton count={1} height={24} containerClassName="w-32" />
            <Skeleton count={1} height={24} containerClassName="w-24" />
          </div>
        </div>
      )}
    </CardWrapper>
  )
}

export default EventCardSkeleton
