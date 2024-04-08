import EventTagsChipsLine from '@components/Chips/EventTagsChipsLine'
import DateTimeEvent from '@components/DateTimeEvent'
import EventUsersCounterAndAge from '@components/EventUsersCounterAndAge'
import PriceDiscount from '@components/PriceDiscount'
import TextInRing from '@components/TextInRing'
import TextLinesLimiter from '@components/TextLinesLimiter'
import UserRelationshipIcon from '@components/UserRelationshipIcon'
import eventStatusFunc from '@helpers/eventStatus'
import { modalsFuncAtom } from '@state/atoms'
import errorAtom from '@state/atoms/errorAtom'
import loadingAtom from '@state/atoms/loadingAtom'
import directionSelector from '@state/selectors/directionSelector'
import subEventsSumOfEventSelector from '@state/selectors/subEventsSumOfEventSelector'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import cn from 'classnames'
import { Suspense } from 'react'
import { useRecoilValue } from 'recoil'
import EventCardSkeleton from './Skeletons/EventCardSkeleton'
import eventSelector from '@state/selectors/eventSelector'
import Button from '@components/Button'

const parentHasAttr = (e, attr) => {
  if (!e.parentNode || e.parentNode.tagName === 'BODY') return false
  if (e.parentNode.getAttribute('data-prevent-parent-click')) return true
  return parentHasAttr(e.parentNode, attr)
}

const EventCardLight = ({
  eventId,
  onTagClick,
  style,
  changeStyle = 'laptop',
}) => {
  const widthNum = useRecoilValue(windowDimensionsNumSelector)

  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const event = useRecoilValue(eventSelector(eventId))

  const eventStatus = eventStatusFunc(event)

  const direction = useRecoilValue(directionSelector(event?.directionId))
  const loading = useRecoilValue(loadingAtom('event' + eventId))
  const error = useRecoilValue(errorAtom('event' + eventId))
  const subEventSum = useRecoilValue(subEventsSumOfEventSelector(eventId))

  if (
    !event ||
    !event.showOnSite ||
    ['finished', 'closed', 'canceled'].includes(eventStatus)
  )
    return null

  return (
    <div
      style={style}
      className="w-full py-0.5 min-w-[270px] max-w-[900px]"
      onClick={(e) => {
        if (!loading && !parentHasAttr(e.target, 'data-prevent-parent-click'))
          modalsFunc.event.view(event._id)
      }}
    >
      <div
        className={cn(
          'bg-white border-t border-b border-gray-400 relative w-full duration-300 shadow-sm hover:shadow-medium-active flex flex-col laptop:flex-row items-center laptop:items-stretch gap-x-2',
          { 'cursor-pointer': !loading }
        )}
      >
        {error && (
          <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center text-2xl text-white bg-red-800 bg-opacity-80">
            ОШИБКА
          </div>
        )}
        {loading && !error && (
          <div className="absolute top-0 bottom-0 left-0 right-0 z-20 flex items-center justify-center bg-general bg-opacity-80">
            <LoadingSpinner />
          </div>
        )}
        {widthNum >= 4 && (
          <div className="relative flex justify-center w-40 h-40 max-h-40">
            {direction?.image ? (
              <img
                className="object-contain w-full laptop:object-cover min-w-32 laptop:w-72"
                src={direction.image}
                alt="direction"
                // width={48}
                // height={48}
              />
            ) : (
              <TextInRing text={direction?.title} />
            )}
          </div>
        )}
        <div className="relative flex flex-col justify-between flex-1 w-full">
          <div className="flex flex-col flex-1">
            <div className="flex pl-2">
              <div
                className={cn(
                  'flex items-center flex-1 h-[36px] gap-x-1',
                  event.showOnSite ? '' : 'pl-10 laptop:pl-0'
                )}
              >
                {subEventSum.usersRelationshipAccess &&
                  subEventSum.usersRelationshipAccess !== 'yes' && (
                    <UserRelationshipIcon
                      relationship={
                        subEventSum.usersRelationshipAccess === 'only'
                      }
                      nameForEvent
                    />
                  )}
                <EventTagsChipsLine
                  tags={event.tags}
                  onTagClick={onTagClick}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="flex flex-1 min-h-[32px] h-[32px]">
              <div className="flex flex-col flex-1 laptop:flex-row">
                <div className="flex items-center justify-center flex-1 gap-2 px-1">
                  <div
                    className={cn(
                      'flex min-h-[64px] flex-col items-stretch justify-center flex-1',
                      'laptop:min-h-[40px]'
                    )}
                  >
                    <TextLinesLimiter
                      className="text-lg italic font-bold text-general laptop:hidden"
                      lines={1}
                    >
                      {direction?.title ?? '[неизвестное направление]'}
                    </TextLinesLimiter>
                    <TextLinesLimiter
                      className="flex-1 text-lg font-bold flex items-center justify-center max-h-[36px] laptop:text-xl"
                      textClassName="leading-[20px] desktop:leading-5"
                      lines={2}
                    >
                      {event.title}
                    </TextLinesLimiter>
                  </div>
                  <PriceDiscount
                    item={subEventSum}
                    className="hidden tablet:flex"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center w-full mt-1">
            <div className="w-full py-1 pl-2 pr-1 border-t">
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
            </div>
          </div>

          {widthNum >= 3 && (
            <div className="max-h-[42px]">
              <div className="flex items-stretch justify-between border-t">
                <EventUsersCounterAndAge event={event} className="h-[42px]" />
                <div className="flex items-center px-1">
                  <Button
                    stopPropagation
                    name="Записаться"
                    onClick={() => modalsFunc.event.signUp(event)}
                  />
                </div>
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
            <div className="flex items-stretch justify-end flex-1 w-full pr-0.5 h-9">
              <PriceDiscount item={subEventSum} className="flex-1 mx-2" />
              <Button
                stopPropagation
                name="Записаться"
                onClick={() => modalsFunc.event.signUp(event)}
                className="my-0.5 tablet:my-0"
                thin
              />
              {/* <EventButtonSignIn eventId={eventId} noButtonIfAlreadySignIn thin /> */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const EventCardWrapper = (props) => {
  return (
    <Suspense fallback={<EventCardSkeleton />}>
      <EventCardLight {...props} />
    </Suspense>
  )
}

export default EventCardWrapper
