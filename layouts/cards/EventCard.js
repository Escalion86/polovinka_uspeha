import { useAtomValue } from 'jotai'

import CardButtons from '@components/CardButtons'
import CardWrapper from '@components/CardWrapper'
import EventTagsChipsLine from '@components/Chips/EventTagsChipsLine'
import DateTimeEvent from '@components/DateTimeEvent'
import EventButtonSignIn from '@components/EventButtonSignIn'
import EventUsersCounterAndAge from '@components/EventUsersCounterAndAge'
import TextInRing from '@components/TextInRing'
import TextLinesLimiter from '@components/TextLinesLimiter'
import eventStatusFunc from '@helpers/eventStatus'
import modalsFuncAtom from '@state/modalsFuncAtom'
import errorAtom from '@state/atoms/errorAtom'
import itemsFuncAtom from '@state/itemsFuncAtom'
import directionSelector from '@state/selectors/directionSelector'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import cn from 'classnames'
import { Suspense } from 'react'
import EventCardSkeleton from './Skeletons/EventCardSkeleton'
import eventCutedSelector from '@state/selectors/eventCutedSelector'
import Venzel1 from '@svg/venzels/1'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { UserRelationshipIconByEventId } from '@components/UserRelationshipIcon'
import { PriceDiscountByEventId } from '@components/PriceDiscount'
import loadingAtom from '@state/atoms/loadingAtom'

const EventCard = ({
  eventId,
  noButtons,
  hidden = false,
  onTagClick,
  style,
  changeStyle = 'laptop',
}) => {
  // const widthNum = useWindowDimensionsTailwindNum()
  const widthNum = useAtomValue(windowDimensionsNumSelector)

  const modalsFunc = useAtomValue(modalsFuncAtom)
  const event = useAtomValue(eventCutedSelector(eventId))

  const eventStatus = eventStatusFunc(event)

  const direction = useAtomValue(directionSelector(event?.directionId))
  const loading = useAtomValue(loadingAtom('event' + eventId))
  const error = useAtomValue(errorAtom('event' + eventId))
  const itemFunc = useAtomValue(itemsFuncAtom)
  // const subEventSum = useAtomValue(subEventsSumOfEventSelector(eventId))
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const canEdit = loggedUserActiveRole?.events?.edit

  if (!event) return null

  if (event.blank)
    return (
      <div
        style={style}
        className={cn(
          'flex flex-col items-center w-full justify-evenly',
          canEdit ? 'cursor-pointer' : ''
        )}
        onClick={canEdit ? () => modalsFunc.event.edit(event._id) : undefined}
      >
        <Venzel1 className="h-10" />
        <div className="flex items-center justify-center py-5 mx-4 text-xl font-bold leading-5 text-center text-black line-clamp-4">
          {/* // border-t-4 border-b-4 border-general"> */}
          {event.title}
        </div>
        <Venzel1 className="h-10 rotate-180" />
      </div>
    )

  // const eventUsers = useAtomValue(eventsUsersFullByEventIdSelector(eventId))

  // const eventLoggedUserStatus = useAtomValue(
  //   loggedUserToEventStatusSelector(eventId)
  // )

  // const eventAssistants = eventUsers
  //   .filter((item) => item.user && item.status === 'assistant')
  //   .map((item) => item.user)

  // const eventAssistants = useAtomValue(eventAssistantsSelector(eventId))

  // const formatedAddress = formatAddress(event.address)

  return (
    <CardWrapper
      loading={loading}
      error={error}
      onClick={() =>
        // !loading &&
        modalsFunc.event.view(event._id)
      }
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
            <div className="absolute text-3xl font-bold -translate-x-1/2 -translate-y-1/2 border-2 bg-white/50 top-1/2 text-danger left-1/2 rotate-15 border-danger shadow-white2">
              Отменено
            </div>
          )}
        </div>
      )} */}
      {((changeStyle === 'laptop' && widthNum >= 4) ||
        (changeStyle === 'desktop' && widthNum >= 5)) && (
        <div
          className={cn(
            'relative justify-center w-40 h-40 max-h-40',
            // 'hidden',
            // changeStyle === 'laptop' ? 'laptop:flex' : 'desktop:flex',
            'flex',
            { 'laptop:w-auto': noButtons }
          )}
        >
          {/* {direction?.image ? (
            <img
              className="object-contain w-full laptop:object-cover min-w-32 laptop:w-72"
              src={direction.image}
              alt="direction"
              // width={48}
              // height={48}
            />
          ) : ( */}
          <TextInRing text={direction?.title} />
          {/* // )} */}

          {eventStatus === 'canceled' && (
            <div className="absolute text-2xl font-bold -translate-x-1/2 -translate-y-1/2 border-2 bg-white/50 top-1/2 text-danger left-1/2 rotate-15 border-danger shadow-white2">
              Отменено
            </div>
          )}
          {['finished', 'closed'].includes(eventStatus) && (
            <div className="absolute text-2xl font-bold -translate-x-1/2 -translate-y-1/2 border-2 bg-white/50 top-1/2 text-success left-1/2 rotate-15 border-success shadow-white2">
              Завершено
            </div>
          )}
          {!event.showOnSite && (
            <div className="absolute text-3xl font-bold text-purple-500 -translate-x-1/2 -translate-y-1/2 border-2 border-purple-500 bg-white/50 top-1/2 left-1/2 -rotate-15 shadow-white2">
              Скрыто
            </div>
          )}
        </div>
      )}
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
      //       <div className="absolute text-3xl font-bold -translate-x-1/2 -translate-y-1/2 border-2 bg-white/50 top-1/2 text-danger left-1/2 rotate-15 border-danger shadow-white2">
      //         Отменено
      //       </div>
      //     )}
      //   </div>
      // )} */}
      <div className="relative flex flex-col justify-between flex-1 w-full">
        <div className="flex flex-col flex-1">
          <div className="flex pl-2">
            <div
              className={cn(
                'flex items-center flex-1 h-[36px] gap-x-1',
                event.showOnSite ? '' : 'pl-10 laptop:pl-0'
              )}
            >
              <UserRelationshipIconByEventId eventId={eventId} />
              {/* <TextLinesLimiter
                className="flex-1 text-lg font-bold laptop:text-xl "
                lines={1}
              >
                {direction.title}
              </TextLinesLimiter> */}
              <EventTagsChipsLine
                tags={event.tags}
                onTagClick={onTagClick}
                className="flex-1"
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
              <div className="flex items-center justify-center flex-1 gap-2 px-1">
                <div
                  className={cn(
                    'flex min-h-[64px] flex-col items-stretch justify-center flex-1',
                    changeStyle === 'laptop'
                      ? 'laptop:min-h-[40px]'
                      : 'desktop:min-h-[40px]'
                  )}
                >
                  <TextLinesLimiter
                    className={cn(
                      'text-lg italic font-bold text-general',
                      changeStyle === 'laptop'
                        ? 'laptop:hidden'
                        : 'desktop:hidden'
                    )}
                    // textClassName="leading-5"
                    lines={1}
                  >
                    {direction?.title ?? '[неизвестное направление]'}
                  </TextLinesLimiter>
                  <TextLinesLimiter
                    className={cn(
                      'flex-1 text-lg font-bold flex items-center justify-center max-h-[36px]',
                      changeStyle === 'laptop'
                        ? 'laptop:text-xl'
                        : 'desktop:text-xl'
                    )}
                    textClassName={cn(
                      'leading-[20px]',
                      changeStyle === 'laptop'
                        ? 'laptop:leading-5'
                        : 'desktop:leading-5'
                    )}
                    lines={2}
                  >
                    {event.title}
                  </TextLinesLimiter>
                </div>
                <PriceDiscountByEventId
                  eventId={eventId}
                  className="hidden tablet:flex"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full mt-1">
          <div className="w-full py-1 pl-2 pr-1 border-t">
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
        </div>

        {widthNum >= 3 && (
          <div className="max-h-[42px]">
            <div className="flex items-stretch justify-between border-t">
              <EventUsersCounterAndAge event={event} className="h-[42px]" />
              <EventButtonSignIn eventId={eventId} noButtonIfAlreadySignIn />
            </div>
          </div>
        )}
      </div>
      {widthNum <= 2 && (
        <div className="flex flex-wrap justify-end flex-1 w-full">
          <EventUsersCounterAndAge
            event={event}
            className="flex-1 min-w-full border-t border-b h-[38px] laptop:h-[42px]"
          />
          <div className="flex items-stretch justify-end flex-1 w-full pr-1 h-9">
            <PriceDiscountByEventId eventId={eventId} className="flex-1 mx-2" />
            <EventButtonSignIn eventId={eventId} noButtonIfAlreadySignIn thin />
          </div>
        </div>
      )}
    </CardWrapper>
  )
}

const EventCardWrapper = (props) => (
  <Suspense fallback={<EventCardSkeleton {...props} />}>
    <EventCard {...props} />
  </Suspense>
)

export default EventCardWrapper
