import React from 'react'
import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import loadingAtom from '@state/atoms/loadingAtom'
import eventSelector from '@state/selectors/eventSelector'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import eventAssistantsSelector from '@state/selectors/eventAssistantsSelector'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'

import CardButtons from '@components/CardButtons'
import formatAddress from '@helpers/formatAddress'
import { CardWrapper } from '@components/CardWrapper'
import directionSelector from '@state/selectors/directionSelector'
import EventUsersCounterAndAge from '@components/EventUsersCounterAndAge'
import PriceDiscount from '@components/PriceDiscount'
import cn from 'classnames'
import EventButtonSignIn from '@components/EventButtonSignIn'
import errorAtom from '@state/atoms/errorAtom'
import DateTimeEvent from '@components/DateTimeEvent'
import TextInRing from '@components/TextInRing'
import NamesOfUsers from '@components/NamesOfUsers'
import TextLinesLimiter from '@components/TextLinesLimiter'
import eventStatusFunc from '@helpers/eventStatus'
import EventTagsChipsLine from '@components/Chips/EventTagsChipsLine'

const EventCard = ({
  eventId,
  noButtons,
  hidden = false,
  onTagClick,
  style,
}) => {
  // const widthNum = useWindowDimensionsTailwindNum()
  const widthNum = useRecoilValue(windowDimensionsNumSelector)

  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const event = useRecoilValue(eventSelector(eventId))
  if (!event) return null
  const eventStatus = eventStatusFunc(event)

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
      style={style}
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
          'hidden laptop:flex relative justify-center w-full laptop:w-40 h-40 max-h-40',
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

        {eventStatus === 'canceled' && (
          <div className="absolute text-2xl font-bold -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-50 border-2 top-1/2 text-danger left-1/2 rotate-15 border-danger shadow-white2">
            Отменено
          </div>
        )}
        {['finished', 'closed'].includes(eventStatus) && (
          <div className="absolute text-2xl font-bold -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-50 border-2 top-1/2 text-success left-1/2 rotate-15 border-success shadow-white2">
            Завершено
          </div>
        )}
        {!event.showOnSite && (
          <div className="absolute text-3xl font-bold text-purple-500 -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-50 border-2 border-purple-500 top-1/2 left-1/2 -rotate-15 shadow-white2">
            Скрыто
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
            <div className="flex items-center flex-1 h-[36px]">
              {/* <TextLinesLimiter
                className="flex-1 text-lg font-bold laptop:text-xl "
                lines={1}
              >
                {direction.title}
              </TextLinesLimiter> */}
              <EventTagsChipsLine
                tags={event.tags}
                onTagClick={onTagClick}
                className={cn(
                  'flex-1',
                  event.showOnSite ? '' : 'ml-10 laptop:ml-0'
                )}
                // noWrap
              />
              {/* <div className="flex-1 truncate w-[90%]">{direction.title}</div> */}
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
                  // className="laptop:hidden"
                />
              )}
            </div>
            {/* <TextLinesLimiter
              className="flex-1 hidden text-lg font-bold laptop:text-xl laptop:block"
              lines={1}
            >
              {event.title}
            </TextLinesLimiter>
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
            )} */}
          </div>
          <div className="flex flex-1 min-h-[32px] h-[32px]">
            <div className="flex flex-col flex-1 laptop:flex-row">
              <div className="flex items-center justify-center flex-1 gap-2 pl-2 pr-1">
                <div className="flex flex-col items-center justify-center flex-1">
                  <TextLinesLimiter
                    className="flex-1 -mt-1 text-lg italic font-bold laptop:text-xl text-general laptop:hidden"
                    // textClassName="leading-5"
                    lines={1}
                  >
                    {direction.title}
                  </TextLinesLimiter>
                  <TextLinesLimiter
                    className="flex items-center flex-1 min-h-[36px] laptop:min-h-[40px] w-full text-lg font-bold text-center laptop:text-xl"
                    textClassName="leading-4 laptop:leading-5"
                    lines={2}
                  >
                    {event.title}
                  </TextLinesLimiter>
                </div>
                <PriceDiscount item={event} className="hidden tablet:flex" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center py-1 pl-2 pr-1 mt-1 border-t border-gray-300">
          {/* <PriceDiscount event={event} className="hidden tablet:flex" /> */}
          {/* <div className="flex flex-wrap justify-between w-full"> */}
          <DateTimeEvent
            wrapperClassName="text-base laptop:text-lg font-bold leading-4 laptop:leading-5 justify-center laptop:justify-start"
            dateClassName="text-general"
            timeClassName="italic"
            durationClassName="italic text-base font-normal"
            event={event}
            showDayOfWeek
            fullMonth
            twoLines={widthNum <= 2}
            showDuration={widthNum > 3}
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
          <div className="flex items-stretch justify-between border-t">
            <EventUsersCounterAndAge eventId={eventId} className="h-[42px]" />
            <EventButtonSignIn
              eventId={eventId}
              noButtonIfAlreadySignIn
              // classNameProfit="rounded-tl-lg"
              // className="border-l border-gray-200"
            />
          </div>
        )}
      </div>
      {widthNum <= 2 && (
        <div className="flex flex-wrap justify-end flex-1 w-full">
          <EventUsersCounterAndAge
            eventId={eventId}
            className="flex-1 min-w-full border-t border-b h-[38px] laptop:h-[42px]"
          />
          <div className="flex items-stretch justify-end flex-1 w-full pr-1 h-9">
            <PriceDiscount item={event} className="flex-1 mx-2" />
            <EventButtonSignIn eventId={eventId} noButtonIfAlreadySignIn thin />
          </div>
        </div>
      )}
    </CardWrapper>
  )
}

export default EventCard
