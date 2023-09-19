import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import cn from 'classnames'
import React from 'react'
import { useRecoilValue } from 'recoil'

const PriceDiscount = ({
  item,
  className,
  prefix,
  vertical,
  priceForStatus,
  mobileVertical,
}) => {
  const loggedUserActiveStatus = useRecoilValue(loggedUserActiveStatusAtom)
  if (!item) return null

  const eventPriceForUser = item.price
    ? priceForStatus
      ? (item.price -
          (item.usersStatusDiscount
            ? item.usersStatusDiscount[priceForStatus]
            : 0)) /
        100
      : loggedUserActiveStatus
      ? (item.price -
          (item.usersStatusDiscount
            ? typeof item.usersStatusDiscount[
                !loggedUserActiveStatus || loggedUserActiveStatus === 'ban'
                  ? 'novice'
                  : loggedUserActiveStatus
              ] === 'number'
              ? item.usersStatusDiscount[
                  !loggedUserActiveStatus || loggedUserActiveStatus === 'ban'
                    ? 'novice'
                    : loggedUserActiveStatus
                ]
              : 0
            : 0)) /
        100
      : item.price / 100
    : 0

  return (
    <div className={cn('flex flex-wrap items-center gap-x-1', className)}>
      {item.price ? (
        eventPriceForUser === item.price / 100 ? (
          <div className="flex items-center text-base font-bold laptop:text-lg gap-x-1 flex-nowrap">
            {prefix && <span className="font-bold tablet:block">{prefix}</span>}
            <span className="whitespace-nowrap">{item.price / 100 + ' ₽'}</span>
          </div>
        ) : (
          <div
            className={cn('flex gap-x-1', {
              'items-center': vertical,
            })}
          >
            {prefix && (
              <span
                className={cn('text-base font-bold', {
                  'mt-3.5': vertical,
                })}
              >
                {prefix}
              </span>
            )}
            <div
              className={cn(
                vertical
                  ? 'relative'
                  : 'flex items-center gap-x-1 laptop:gap-x-2',
                mobileVertical ? 'relative' : ''
              )}
            >
              {!priceForStatus && (
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
                  mobileVertical ? 'mt-3 laptop:mt-0' : ''
                )}
              >
                {eventPriceForUser + ' ₽'}
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="text-lg font-bold uppercase whitespace-normal">
          Бесплатное
        </div>
      )}
    </div>
  )
}

export default PriceDiscount
