import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import cn from 'classnames'
import React from 'react'
import { useRecoilValue } from 'recoil'

const PriceDiscount = ({
  item,
  user,
  className,
  prefix,
  vertical,
  priceForStatus,
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
          <div className="flex items-center text-lg font-bold gap-x-1 flex-nowrap">
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
              className={vertical ? 'relative' : 'flex items-center gap-x-2'}
            >
              {!priceForStatus && (
                <div
                  className={cn('text-center whitespace-normal', {
                    'absolute top-0 left-0 right-0': vertical,
                  })}
                >
                  <div className="relative">
                    <div className="whitespace-nowrap">
                      {item.price / 100 + ' ₽'}
                    </div>
                    <div className="absolute top-[11px] left-0 right-0 transform rotate-15 border-b-2 border-danger" />
                    <div className="absolute top-[11px] left-0 right-0 transform -rotate-15 border-b-2 border-danger" />
                  </div>
                </div>
              )}
              <div
                className={cn('whitespace-nowrap text-xl font-bold', {
                  'mt-3.5': vertical,
                })}
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
