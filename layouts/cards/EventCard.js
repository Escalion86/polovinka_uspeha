import React from 'react'

import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import formatDateTime from '@helpers/formatDateTime'
import CardButtons from '@components/CardButtons'
import formatAddress from '@helpers/formatAddress'
import loadingAtom from '@state/atoms/loadingAtom'
import eventSelector from '@state/selectors/eventSelector'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import { CardWrapper } from '@components/CardWrapper'
import directionSelector from '@state/selectors/directionSelector'
import { useWindowDimensionsTailwindNum } from '@helpers/useWindowDimensions'
import UserNameById from '@components/UserNameById'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import UserName from '@components/UserName'
import EventUsersCounterAndAge from '@components/EventUsersCounterAndAge'
import PriceDiscount from '@components/PriceDiscount'
import cn from 'classnames'

const EventCard = ({ eventId, noButtons }) => {
  const widthNum = useWindowDimensionsTailwindNum()

  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const event = useRecoilValue(eventSelector(eventId))
  const direction = useRecoilValue(directionSelector(event?.directionId))
  const loading = useRecoilValue(loadingAtom('event' + eventId))
  const itemFunc = useRecoilValue(itemsFuncAtom)
  const eventUsers = useRecoilValue(eventsUsersFullByEventIdSelector(eventId))

  if (!event) return null

  const eventAssistants = eventUsers
    .filter((item) => item.status === 'assistant')
    .map((item) => item.user)

  const formatedAddress = formatAddress(event.address)

  return (
    <CardWrapper
      loading={loading}
      onClick={() => !loading && modalsFunc.event.view(event._id)}
      showOnSite={event.showOnSite}
      gap={false}
    >
      {event?.images && event.images.length > 0 && (
        <div
          className={cn(
            'relative flex justify-center flex-1 phoneH:flex-none',
            { 'w-full laptop:w-auto': noButtons }
          )}
        >
          <img
            className="object-cover w-32 h-full min-w-32 min-h-42 tablet:w-40 tablet:h-40 max-h-60"
            src={event.images[0]}
            alt="event"
            // width={48}
            // height={48}
          />
          {event.status === 'canceled' && (
            <div className="absolute text-3xl font-bold -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-50 border-2 top-1/2 text-danger left-1/2 rotate-15 border-danger shadow-white2">
              Отменено
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col justify-between flex-1 w-full">
        <div className="pl-2">
          <div className="flex items-stretch">
            <div className="flex-1 text-lg flex items-center italic font-bold text-general">
              {direction.title}
            </div>

            {!noButtons && (
              <CardButtons
                item={event}
                typeOfItem="event"
                showOnSiteOnClick={() => {
                  itemFunc.event.set({
                    _id: event._id,
                    showOnSite: !event.showOnSite,
                  })
                }}
              />
            )}
          </div>
          <div className="flex flex-col tablet:flex-row">
            <div className="flex justify-between flex-1 pr-1">
              <div className="flex-1">
                <div className="text-xl font-bold ">{event.title}</div>
                <div className="flex flex-1">{event.description}</div>
                {formatedAddress && (
                  <div className="flex leading-5 gap-x-1">
                    <span className="italic font-bold">Адрес:</span>
                    <span>{formatedAddress}</span>
                  </div>
                )}
                {event.organizerId && (
                  <div className="flex leading-5 gap-x-1">
                    <span className="font-bold">Организатор:</span>
                    <UserNameById userId={event.organizerId} noWrap />
                  </div>
                )}
                {eventAssistants &&
                  typeof eventAssistants === 'object' &&
                  eventAssistants.length > 0 && (
                    <div className="flex leading-5 gap-x-1">
                      <span className="font-bold">
                        {eventAssistants.length > 1 ? 'Ведущие:' : 'Ведущий:'}
                      </span>
                      <div className="flex flex-wrap gap-x-1">
                        {eventAssistants.map((user, index) => {
                          if (index < eventAssistants.length - 1) {
                            return (
                              <div
                                key={'assistant' + user._id}
                                className="flex flex-nowrap"
                              >
                                <UserName user={user} noWrap />
                                <span>,</span>
                              </div>
                            )
                          } else
                            return (
                              <UserName
                                key={'assistant' + user._id}
                                user={user}
                              />
                            )
                        })}
                      </div>
                    </div>
                  )}
              </div>
            </div>
            <div className="flex flex-col items-end tablet:justify-between h-full pr-1 tablet:min-h-[6rem]">
              <PriceDiscount event={event} vertical />
              <div className="text-lg font-bold leading-5 text-right whitespace-normal min-w-24 tablet:whitespace-pre-wrap text-general">
                {formatDateTime(event.date, false, false, true, true)}
              </div>
            </div>
          </div>
        </div>
        {widthNum >= 3 && (
          <EventUsersCounterAndAge eventId={eventId} className="border-t" />
        )}
      </div>
      {widthNum <= 2 && (
        <EventUsersCounterAndAge
          eventId={eventId}
          className="flex-1 min-w-full border-t"
        />
      )}
    </CardWrapper>
  )
}

export default EventCard
