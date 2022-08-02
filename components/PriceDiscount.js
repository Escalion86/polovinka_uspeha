import loggedUserAtom from '@state/atoms/loggedUserAtom'
import cn from 'classnames'
import React from 'react'
import { useRecoilValue } from 'recoil'

const PriceDiscount = ({ event, user, className, prefix }) => {
  const loggedUser = useRecoilValue(loggedUserAtom)

  const useUser = user ?? loggedUser

  const eventPriceForUser = event.price
    ? useUser?.status
      ? (event.price - event.usersStatusDiscount[useUser.status] ?? 0) / 100
      : event.price / 100
    : 0

  return (
    <div
      className={cn('flex flex-wrap items-center flex-1 gap-x-1', className)}
    >
      {event.price ? (
        eventPriceForUser === event.price / 100 ? (
          <div className="flex gap-x-1 text-lg font-bold">
            {prefix && <span>{prefix}</span>}
            <span className="whitespace-normal">
              {event.price / 100 + ' ₽'}
            </span>
          </div>
        ) : (
          <div className="flex gap-x-1">
            {prefix && (
              <span className="mt-3.5 text-lg  font-bold">{prefix}</span>
            )}
            <div className="relative">
              <div className="text-center whitespace-normal absolute top-0 left-0 right-0 text-sm">
                <div className="relative">
                  <div>{event.price / 100 + ' ₽'}</div>
                  <div className="absolute top-[8px] left-0 right-0 transform rotate-15 border-b-2 border-danger" />
                  <div className="absolute top-[8px] left-0 right-0 transform -rotate-15 border-b-2 border-danger" />
                </div>
              </div>
              <div className="mt-3.5 whitespace-normal text-xl font-bold">
                {eventPriceForUser + ' ₽'}
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="whitespace-normal text-lg font-bold">Бесплатное</div>
      )}
    </div>
  )
}

export default PriceDiscount
