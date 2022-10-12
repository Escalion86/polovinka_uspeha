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
import errorAtom from '@state/atoms/errorAtom'
import DateTimeEvent from '@components/DateTimeEvent'
import TextInRing from '@components/TextInRing'
import NamesOfUsers from '@components/NamesOfUsers'

const EventCard = ({ eventId, noButtons, hidden = false }) => {
  const widthNum = useWindowDimensionsTailwindNum()

  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const event = useRecoilValue(eventSelector(eventId))
  if (!event) return null

  const direction = useRecoilValue(directionSelector(event?.directionId))
  const loading = useRecoilValue(loadingAtom('event' + eventId))
  const error = useRecoilValue(errorAtom('event' + eventId))
  const itemFunc = useRecoilValue(itemsFuncAtom)
  // const eventUsers = useRecoilValue(eventsUsersFullByEventIdSelector(eventId))

  // const eventLoggedUserStatus = useRecoilValue(
  //   loggedUserToEventStatusSelector(eventId)
  // )

  // const eventAssistants = eventUsers
  //   .filter((item) => item.user && item.status === 'assistant')
  //   .map((item) => item.user)

  const eventAssistants = useRecoilValue(eventAssistantsSelector(eventId))

  const formatedAddress = formatAddress(event.address)

  return (
    <CardWrapper
      loading={loading}
      error={error}
      onClick={() => !loading && modalsFunc.event.view(event._id)}
      showOnSite={event.showOnSite}
      gap={false}
      hidden={hidden}
    >
      {/* <div className="flex items-stretch"> */}
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
      <div
        className={cn(
          'hidden laptop:flex relative justify-center w-full laptop:w-44 h-44 max-h-44',
          { 'laptop:w-auto': noButtons }
        )}
      >
        {direction?.image ? (
          <img
            className="object-contain w-full laptop:object-cover min-w-32 laptop:w-72"
            src={direction.image}
            alt="direction"
            // width={48}
            // height={48}
          />
        ) : (
          <TextInRing text={direction.title} />
        )}

        {event.status === 'canceled' && (
          <div className="absolute text-3xl font-bold -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-50 border-2 top-1/2 text-danger left-1/2 rotate-15 border-danger shadow-white2">
            Отменено
          </div>
        )}
      </div>
      {/* // ) : (
      //   <div
      //     className={cn(
      //       'hidden tablet:flex relative justify-center flex-1 phoneH:flex-none h-44 max-h-44',
      //       { 'laptop:w-auto': noButtons }
      //     )}
      //   >
      //     <img
      //       className="object-contain w-full laptop:object-cover min-w-32 laptop:w-72"
      //       src={direction.image}
      //       alt="direction"
      //       // width={48}
      //       // height={48}
      //     />
      //     {event.status === 'canceled' && (
      //       <div className="absolute text-3xl font-bold -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-50 border-2 top-1/2 text-danger left-1/2 rotate-15 border-danger shadow-white2">
      //         Отменено
      //       </div>
      //     )}
      //   </div>
      // )} */}
      <div className="relative flex flex-col justify-between flex-1 w-full">
        <div className="flex flex-col flex-1">
          <div className="flex pl-2">
            <div className="flex flex-1 text-xl font-bold laptop:hidden text-general">
              <div className="flex-1">{direction.title}</div>
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
                  className="laptop:hidden"
                />
              )}
            </div>
            <div className="flex-1 hidden text-xl font-bold laptop:block">
              {event.title}
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
                className="hidden laptop:flex"
              />
            )}
          </div>
          <div className="flex">
            <div className="flex flex-col flex-1 laptop:flex-row">
              <div className="flex justify-between flex-1 pl-2 pr-1">
                <div className="flex-1 text-xl font-bold laptop:hidden">
                  {event.title}
                </div>
                <div className="flex-1 hidden laptop:block">
                  {/* <div className="flex flex-1">{event.description}</div> */}
                  {/* <div className="flex flex-1 textarea" dangerouslySetInnerHTML={{ __html: event.description }} /> */}
                  {formatedAddress && (
                    <div className="flex leading-5 gap-x-1">
                      <span className="italic font-bold">Адрес:</span>
                      <span>{formatedAddress}</span>
                    </div>
                  )}
                  {/* {event.organizerId && (
                  <div className="flex leading-5 gap-x-1">
                    <span className="font-bold">Организатор:</span>
                    <UserNameById userId={event.organizerId} noWrap />
                  </div>
                )} */}
                  <NamesOfUsers
                    users={eventAssistants}
                    title={eventAssistants.length > 1 ? 'Ведущие:' : 'Ведущий:'}
                  />
                  {/* {eventAssistants &&
                  eventAssistants?.length > 0 && (
                    <div className="flex leading-5 gap-x-1">
                      <span className="font-bold">
                        {eventAssistants.length > 1 ? 'Ведущие:' : 'Ведущий:'}
                      </span>
                      <div className="flex flex-wrap items-center gap-x-1 ">
                        {eventAssistants.map((user, index) => {
                          if (index < eventAssistants.length - 1) {
                            return (
                              <div
                                key={'assistant' + user._id}
                                className="flex items-center flex-nowrap"
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
                  )} */}
                </div>
              </div>
              <div className="flex flex-col items-center h-full pt-1 pl-2 pr-1">
                <PriceDiscount event={event} className="hidden laptop:flex" />
                {/* <div className="flex justify-between w-full tablet:flex-col">
                <div className="text-lg font-bold leading-5 whitespace-normal tablet:text-right min-w-24 laptop:whitespace-pre-wrap text-general">
                  {formatDateTime(event.date, false, false, true, false)}
                </div>
                <div className="text-lg font-bold leading-5 text-right whitespace-normal min-w-24 laptop:whitespace-pre-wrap text-general">
                  {formatMinutes(event.duration ?? 60)}
                </div>
              </div> */}
              </div>
            </div>
            <div>
              <PriceDiscount
                event={event}
                className="hidden tablet:flex laptop:hidden"
              />
            </div>
          </div>
        </div>
        <div className="py-1 pl-2 pr-1 mt-1 border-t border-gray-300">
          {/* <PriceDiscount event={event} className="hidden tablet:flex" /> */}
          {/* <div className="flex flex-wrap justify-between w-full"> */}
          <DateTimeEvent
            wrapperClassName="text-lg font-bold leading-5 justify-center laptop:justify-start"
            dateClassName="text-general"
            timeClassName="italic"
            durationClassName="italic text-base font-normal"
            event={event}
            showDayOfWeek
            fullMonth
            showDuration
          />
          {/* <div className="text-lg font-bold leading-5 whitespace-nowrap tablet:text-right min-w-24 laptop:whitespace-pre-wrap text-general">
              {formatDateTime(
                event.date,
                false,
                false,
                true,
                false,
                event.duration
              )}
            </div> */}
          {/* <div className="text-lg font-bold leading-5 text-right whitespace-nowrap min-w-24 laptop:whitespace-pre-wrap text-general">
              {formatMinutes(event.duration ?? 60)}
            </div> */}
          {/* </div> */}
        </div>

        {widthNum >= 3 && (
          <div className="flex items-center justify-between border-t">
            <EventUsersCounterAndAge eventId={eventId} />
            <EventButtonSignIn
              eventId={eventId}
              className="mx-1"
              noButtonIfAlreadySignIn
            />
          </div>
        )}
      </div>
      {widthNum <= 2 && (
        <div className="flex flex-wrap justify-end flex-1 w-full">
          <EventUsersCounterAndAge
            eventId={eventId}
            className="flex-1 min-w-full border-t border-b"
          />
          <PriceDiscount
            event={event}
            className="flex-1 mx-2"
            prefix="Стоимость:"
          />
          <EventButtonSignIn
            eventId={eventId}
            className="m-1"
            noButtonIfAlreadySignIn
          />
        </div>
      )}
    </CardWrapper>
  )
}

export default EventCard
