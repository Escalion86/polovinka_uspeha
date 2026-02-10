import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import Skeleton from 'react-loading-skeleton'
import { useAtomValue } from 'jotai'
import CardWrapper from '@components/CardWrapper'

const EventCard2Skeleton = ({ hidden, style, loading }) => {
  const widthNum = useAtomValue(windowDimensionsNumSelector)
  const showDesktopBar = widthNum >= 4

  return (
    <CardWrapper
      loading={loading}
      showOnSite
      gap={false}
      hidden={hidden}
      style={style}
      outerClassName="px-3 py-2"
      className="h-[calc(100%-4px)] rounded-[30px] border border-[rgba(107,31,42,0.16)] shadow-[0_18px_36px_rgba(0,0,0,0.12)]"
      bgClassName="bg-white"
    >
      <div className="flex flex-col w-full h-full overflow-hidden">
        <div className="w-full rounded-t-[30px] bg-[linear-gradient(135deg,rgba(107,31,42,0.12),rgba(79,176,232,0.18))] px-5 py-4">
          <div className="flex items-center justify-between w-full gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Skeleton circle height={18} width={18} />
              <Skeleton height={20} width={180} />
              <Skeleton height={20} width={90} />
            </div>
            <Skeleton height={24} width={56} />
          </div>
        </div>

        <div className="flex flex-col flex-1 w-full px-3 pt-4 pb-2 gap-x-4 laptop:flex-row">
          <div className="flex items-start w-full gap-4 laptop:w-auto">
            <div className="h-20 w-20 tablet:h-24 tablet:w-24 shrink-0 overflow-hidden rounded-[20px] tablet:rounded-[30px] border border-[#f0e5ea] bg-white/80">
              <Skeleton height="100%" width="100%" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between w-full gap-3">
                <div className="flex-1">
                  <Skeleton height={22} width="90%" />
                  <Skeleton height={22} width="70%" className="mt-2" />
                </div>
                <div className="hidden tablet:inline-flex rounded-full bg-[#f7f1f4] px-3 py-1 laptop:hidden">
                  <Skeleton height={22} width={72} />
                </div>
              </div>
              <div className="flex items-center justify-between w-full gap-3 mt-3">
                <Skeleton height={18} width={220} />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end justify-center flex-1">
            <div className="hidden w-fit rounded-full bg-[#f7f1f4] px-3 py-1 laptop:inline-flex">
              <Skeleton height={24} width={90} />
            </div>
            <div className="laptop:hidden mt-auto flex flex-col tablet:flex-row w-full flex-wrap items-center justify-between gap-3 rounded-[30px] border border-[#f0e5ea] bg-white/90 px-4 py-2 shadow-[0_10px_18px_rgba(0,0,0,0.06)]">
              <Skeleton height={22} width={200} />
              <Skeleton height={28} width={130} />
            </div>
          </div>
        </div>

        {showDesktopBar && (
          <div className="rounded-[30px] overflow-hidden hidden laptop:flex w-full flex-wrap items-center justify-between gap-3 border border-[#f0e5ea] bg-white/90 px-4 py-3 shadow-[0_10px_18px_rgba(0,0,0,0.06)]">
            <Skeleton height={22} width={240} />
            <Skeleton height={30} width={140} />
          </div>
        )}
      </div>
    </CardWrapper>
  )
}

export default EventCard2Skeleton
