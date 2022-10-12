import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
import cn from 'classnames'
import React from 'react'
import { useRecoilValue } from 'recoil'

const PriceDiscount = ({ event, user, className, prefix, vertical }) => {
  const loggedUserActiveStatus = useRecoilValue(loggedUserActiveStatusAtom)
  if (!event) return null

  const eventPriceForUser = event.price
    ? loggedUserActiveStatus
      ? (event.price - event.usersStatusDiscount[loggedUserActiveStatus] ?? 0) /
        100
      : event.price / 100
    : 0

  return (
    <div className={cn('flex flex-wrap items-center gap-x-1', className)}>
      {event.price ? (
        eventPriceForUser === event.price / 100 ? (
          <div className="flex items-center text-lg font-bold gap-x-1 flex-nowrap">
            {prefix && <span className="text-base font-normal">{prefix}</span>}
            <span className="whitespace-nowrap">
              {event.price / 100 + ' ₽'}
            </span>
          </div>
        ) : (
          <div
            className={cn('flex gap-x-1', {
              'items-center': vertical,
            })}
          >
            {prefix && (
              <span
                className={cn('font-bold', {
                  'mt-3.5': vertical,
                })}
              >
                {prefix}
              </span>
            )}
            <div
              className={vertical ? 'relative' : 'flex items-center gap-x-2'}
            >
              <div
                className={cn('text-center whitespace-normal', {
                  'absolute top-0 left-0 right-0': vertical,
                })}
              >
                <div className="relative">
                  <div className="whitespace-nowrap">
                    {event.price / 100 + ' ₽'}
                  </div>
                  <div className="absolute top-[11px] left-0 right-0 transform rotate-15 border-b-2 border-danger" />
                  <div className="absolute top-[11px] left-0 right-0 transform -rotate-15 border-b-2 border-danger" />
                </div>
              </div>
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
        <div className="text-lg font-bold whitespace-normal">Бесплатное</div>
      )}
    </div>
  )
}

export default PriceDiscount
