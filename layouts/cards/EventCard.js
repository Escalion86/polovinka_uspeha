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
// import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import UserName from '@components/UserName'
import EventUsersCounterAndAge from '@components/EventUsersCounterAndAge'
import PriceDiscount from '@components/PriceDiscount'
import cn from 'classnames'
import eventAssistantsSelector from '@state/selectors/eventAssistantsSelector'
import formatMinutes from '@helpers/formatMinutes'
import loggedUserToEventStatusSelector from '@state/selectors/loggedUserToEventStatusSelector'
import EventButtonSignIn from '@components/EventButtonSignIn'

const EventCard = ({ eventId, noButtons }) => {
  const widthNum = useWindowDimensionsTailwindNum()

  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const event = useRecoilValue(eventSelector(eventId))
  if (!event) return null

  const direction = useRecoilValue(directionSelector(event?.directionId))
  const loading = useRecoilValue(loadingAtom('event' + eventId))
  const itemFunc = useRecoilValue(itemsFuncAtom)
  // const eventUsers = useRecoilValue(eventsUsersFullByEventIdSelector(eventId))

  const eventLoggedUserStatus = useRecoilValue(
    loggedUserToEventStatusSelector(eventId)
  )

  // const eventAssistants = eventUsers
  //   .filter((item) => item.user && item.status === 'assistant')
  //   .map((item) => item.user)

  const eventAssistants = useRecoilValue(eventAssistantsSelector(eventId))

  const formatedAddress = formatAddress(event.address)

  return (
    <CardWrapper
      loading={loading}
      onClick={() => !loading && modalsFunc.event.view(event._id)}
      showOnSite={event.showOnSite}
      gap={false}
    >
      {/* {event?.images && event.images.length > 0 && (
        <div
          className={cn(
            'relative flex justify-center flex-1 phoneH:flex-none',
            { 'laptop:w-auto': noButtons }
          )}
        >
          <img
            className="object-cover w-32 h-full min-w-32 min-h-42 laptop:w-40 laptop:h-40 max-h-60"
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
      )} */}
      {direction?.image && (
        <div
          className={cn(
            'relative flex justify-center flex-1 phoneH:flex-none h-44 max-h-44 tablet:h-52 tablet:max-h-52',
            { 'laptop:w-auto': noButtons }
          )}
        >
          <img
            className="object-contain w-full laptop:object-cover min-w-32 laptop:w-80"
            src={direction.image}
            alt="direction"
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
            <div className="flex items-center flex-1 text-lg italic font-bold text-general">
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
                {/* <div className="flex flex-1">{event.description}</div> */}
                {/* <div className="flex flex-1" dangerouslySetInnerHTML={{ __html: event.description }} /> */}
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
            <div className="flex flex-col items-end laptop:justify-between h-full pr-1 laptop:min-h-[6rem]">
              <PriceDiscount event={event} />
              <div className="text-lg font-bold leading-5 text-right whitespace-normal min-w-24 laptop:whitespace-pre-wrap text-general">
                {formatDateTime(event.date, false, false, true, false)}
              </div>
              <div className="text-lg font-bold leading-5 text-right whitespace-normal min-w-24 laptop:whitespace-pre-wrap text-general">
                {formatMinutes(event.duration ?? 60)}
              </div>
            </div>
          </div>
        </div>

        {widthNum >= 3 && (
          <div className="flex items-center justify-between border-t">
            <EventUsersCounterAndAge eventId={eventId} />
            <EventButtonSignIn eventId={eventId} className="mx-1" />
          </div>
        )}
      </div>
      {widthNum <= 2 && (
        <div className="flex flex-wrap justify-end flex-1 w-full">
          <EventUsersCounterAndAge
            eventId={eventId}
            className="flex-1 min-w-full border-t border-b"
          />
          <EventButtonSignIn eventId={eventId} className="m-1" />
        </div>
      )}
    </CardWrapper>
  )
}

export default EventCard
