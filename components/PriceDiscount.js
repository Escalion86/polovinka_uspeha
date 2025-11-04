import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import subEventsSumOfEventSelector from '@state/selectors/subEventsSumOfEventSelector'
import cn from 'classnames'
import { useAtomValue } from 'jotai'
import { Suspense } from 'react'
import Skeleton from 'react-loading-skeleton'

const PriceDiscountByEventIdComponent = ({ eventId, ...props }) => {
  const subEventSum = useAtomValue(subEventsSumOfEventSelector(eventId))
  return <PriceDiscount {...props} item={subEventSum} />
}

export const PriceDiscountByEventId = (props) => (
  <Suspense
    fallback={
      <div
        className={cn(
          '-mt-1 flex flex-wrap items-center gap-x-1',
          props?.className
        )}
      >
        <Skeleton className="w-[60px] laptop:w-[75px] h-6 laptop:h-7" />
      </div>
    }
  >
    <PriceDiscountByEventIdComponent {...props} />
  </Suspense>
)

const PriceDiscount = ({
  item,
  className,
  prefix,
  vertical,
  priceForStatus,
  mobileVertical,
}) => {
  const loggedUserActiveStatus = useAtomValue(loggedUserActiveStatusAtom)
  if (!item) return null

  const fixedUserStatus =
    !loggedUserActiveStatus || loggedUserActiveStatus === 'ban'
      ? 'novice'
      : loggedUserActiveStatus

  const eventPriceForUser = item.price
    ? priceForStatus
      ? (item.price -
          (item.usersStatusDiscount
            ? item.usersStatusDiscount[priceForStatus]
            : 0)) /
        100
      : loggedUserActiveStatus
        ? (item.usersStatusDiscountResult
            ? item.usersStatusDiscountResult[fixedUserStatus]
            : item.price -
              (item.usersStatusDiscount
                ? typeof item.usersStatusDiscount[fixedUserStatus] === 'number'
                  ? item.usersStatusDiscount[fixedUserStatus]
                  : 0
                : 0)) / 100
        : item.price / 100
    : 0

  return (
    <div className={cn('flex flex-wrap items-center gap-x-1', className)}>
      {/* {item.price ? ( */}
      {/* // eventPriceForUser === item.price / 100 ? (
        //   <div className="flex items-center text-lg font-bold laptop:text-xl gap-x-1 flex-nowrap">
        //     {prefix && <span className="font-bold tablet:block">{prefix}</span>}
        //     <span className="whitespace-nowrap">{item.price / 100 + ' ₽'}</span>
        //   </div>
        // ) : ( */}
      <div
        className={cn('flex gap-x-1', vertical ? 'items-center' : 'items-end')}
      >
        {prefix && (
          <span
            className={cn(
              'text-base font-bold flex items-center',
              vertical ? 'mt-3.5' : 'h-7'
            )}
          >
            {prefix}
          </span>
        )}
        <div
          className={cn(
            vertical ? '' : 'flex items-center gap-x-1 laptop:gap-x-2',
            mobileVertical || vertical ? 'relative' : ''
          )}
        >
          {item.usersStatusDiscountResult &&
          item.usersStatusDiscountResult[
            fixedUserStatus === 'member' ? 'memberFrom' : 'noviceFrom'
          ]
            ? ' от'
            : !priceForStatus &&
              !!item.price &&
              item.price / 100 !== eventPriceForUser && (
                <div
                  className={cn(
                    'text-sm laptop:text-base text-center whitespace-normal',
                    {
                      'absolute top-0 left-0 right-0': vertical,
                    },
                    mobileVertical
                      ? 'absolute laptop:block top-0 left-0 right-0 laptop:top-auto laptop:left-auto laptop:right-auto laptop:relative'
                      : ''
                  )}
                >
                  <div className="relative">
                    <div className="whitespace-nowrap">
                      {item.price / 100 + ' ₽'}
                    </div>
                    <div className="absolute top-[9px] laptop:top-[11px] left-0 right-0 transform rotate-15 border-b-1 laptop:border-b-2 border-danger" />
                    <div className="absolute top-[9px] laptop:top-[11px] left-0 right-0 transform -rotate-15 border-b-1 laptop:border-b-2 border-danger" />
                  </div>
                </div>
              )}
          <div
            className={cn(
              'whitespace-nowrap text-lg laptop:text-xl font-bold',
              {
                'mt-3.5': vertical,
              },
              mobileVertical ? 'mt-3 laptop:mt-0' : '',
              eventPriceForUser ? 'uppercase' : ''
            )}
          >
            {eventPriceForUser ? eventPriceForUser + ' ₽' : 'Бесплатно'}
          </div>
        </div>
      </div>
      {/* // )
      //  : (
      //   // )
      //   <div className="text-lg font-bold uppercase whitespace-normal">
      //     Бесплатно
      //   </div>
      // )} */}
    </div>
  )
}

export default PriceDiscount
