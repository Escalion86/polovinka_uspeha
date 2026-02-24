import { useAtomValue } from 'jotai'

import EventCardButtons from '@components/cardButtons/EventCardButtons'
import CardWrapper from '@components/CardWrapper'
import DateTimeEvent from '@components/DateTimeEvent'
import EventButtonSignIn from '@components/EventButtonSignIn'
import EventFreePlacesBadge from '@components/EventFreePlacesBadge'
import TextInRing from '@components/TextInRing'
import eventStatusFunc from '@helpers/eventStatus'
import modalsFuncAtom from '@state/modalsFuncAtom'
import errorAtom from '@state/atoms/errorAtom'
import itemsFuncAtom from '@state/itemsFuncAtom'
import directionSelector from '@state/selectors/directionSelector'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import cn from 'classnames'
import { Suspense } from 'react'
import eventCutedSelector from '@state/selectors/eventCutedSelector'
import Venzel1 from '@svg/venzels/1'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { UserRelationshipIconByEventId } from '@components/UserRelationshipIcon'
import { PriceDiscountByEventId } from '@components/PriceDiscount'
import loadingAtom from '@state/atoms/loadingAtom'
import TextLinesLimiter from '@components/TextLinesLimiter'
import EventCard2Skeleton from './Skeletons/EventCard2Skeleton'
import Skeleton from 'react-loading-skeleton'

const badgeClassName =
  'inline-flex items-center rounded-full bg-[#4fb0e8]/15 px-3 py-1 text-sm font-semibold text-[#1f6e9c]'

const EventCard2 = ({ eventId, noButtons, hidden = false, style }) => {
  const widthNum = useAtomValue(windowDimensionsNumSelector)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const event = useAtomValue(eventCutedSelector(eventId))

  const eventStatus = eventStatusFunc(event)

  const direction = useAtomValue(directionSelector(event?.directionId))
  const loading = useAtomValue(loadingAtom('event' + eventId))
  const error = useAtomValue(errorAtom('event' + eventId))
  const itemFunc = useAtomValue(itemsFuncAtom)
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
        <div className="flex items-center justify-center py-5 mx-4 text-xl font-bold leading-5 text-center text-black whitespace-pre-line">
          {event.title}
        </div>
        <Venzel1 className="h-10 rotate-180" />
      </div>
    )

  const statusBadge =
    eventStatus === 'canceled'
      ? 'Отменено'
      : ['finished', 'closed'].includes(eventStatus)
        ? 'Завершено'
        : null

  const previewImage = Array.isArray(event?.images)
    ? event.images[0]
    : event?.images

  return (
    <CardWrapper
      loading={loading}
      error={error}
      onClick={() => modalsFunc.event.view(event._id)}
      showOnSite={event.showOnSite}
      gap={false}
      hidden={hidden}
      style={style}
      outerClassName="px-3 py-2"
      className="h-[calc(100%-4px)] rounded-[30px] border border-[rgba(107,31,42,0.16)] shadow-[0_18px_36px_rgba(0,0,0,0.12)] hover:shadow-[0_28px_46px_rgba(0,0,0,0.18)]"
      bgClassName="bg-white"
    >
      <div className="flex flex-col w-full h-full overflow-hidden">
        <div className="w-full rounded-t-[30px] bg-[linear-gradient(135deg,rgba(107,31,42,0.12),rgba(79,176,232,0.18))] px-5 py-4">
          <div className="flex items-center justify-between w-full gap-3">
            <div className="flex items-center gap-2">
              <UserRelationshipIconByEventId eventId={eventId} />
              <span className="inline-flex items-center rounded-full border border-[rgba(107,31,42,0.25)] bg-white/80 px-3 py-1 text-xs font-semibold tracking-[0.08em] uppercase text-[#6b1f2a]">
                {direction?.title ?? '[неизвестное Пространство]'}
              </span>
              {statusBadge ? (
                <span className="inline-flex rounded-full border border-[#f0e5ea] bg-white/90 px-3 py-1 text-xs font-semibold text-[#6b1f2a]">
                  {statusBadge}
                </span>
              ) : null}
            </div>
            {!noButtons && (
              <EventCardButtons
                item={event}
                showOnSiteOnClick={() => {
                  itemFunc.event.set({
                    _id: event._id,
                    showOnSite: !event.showOnSite,
                  })
                }}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 w-full px-3 pt-4 pb-2 gap-x-4 laptop:flex-row">
          <div className="flex items-start w-full gap-4 laptop:w-auto">
            <div className="relative h-20 w-20 tablet:h-24 tablet:w-24 shrink-0 overflow-hidden rounded-[20px] tablet:rounded-[30px] border border-[#f0e5ea] bg-white/80 shadow-[0_12px_22px_rgba(0,0,0,0.08)]">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt=""
                  className="object-cover w-full h-full"
                />
              ) : (
                <TextInRing text={direction?.title} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between w-full gap-3">
                <TextLinesLimiter
                  className="text-[clamp(20px,2.6vw,28px)] font-bold leading-7 text-[#4b0f1c] max-h-[72px]"
                  textCenter={false}
                  lines={2}
                >
                  {event.title}
                </TextLinesLimiter>
                {/* <div className="text-[clamp(20px,2.6vw,28px)] font-bold leading-7 text-[#4b0f1c] whitespace-pre-line max-h-[72px]">
                  
                </div> */}
                <div className="hidden tablet:inline-flex rounded-full bg-[#f7f1f4] px-3 py-1 laptop:hidden">
                  <PriceDiscountByEventId
                    eventId={eventId}
                    className="text-[#6b1f2a]"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between w-full gap-3 mt-3">
                <DateTimeEvent
                  wrapperClassName="text-base laptop:text-lg font-bold leading-4 laptop:leading-5 whitespace-nowrap"
                  dateClassName="text-general"
                  timeClassName="italic"
                  durationClassName="italic text-base font-normal"
                  event={event}
                  showDayOfWeek
                  fullMonth
                  twoLines={false}
                  showDuration={widthNum > 3}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end justify-center flex-1">
            <div className="rounded-full hidden w-fitrounded-full bg-[#f7f1f4] px-3 py-1 laptop:inline-flex">
              <PriceDiscountByEventId
                eventId={eventId}
                className="font-futura font-semibold text-[18px] tablet:text-[26px] text-[#6b1f2a]"
              />
            </div>
            <div className="laptop:hidden mt-auto flex flex-col w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-[30px] border border-[#f0e5ea] bg-white/90 px-4 py-2 shadow-[0_10px_18px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-center w-full tablet:w-auto gap-x-1">
                <Suspense
                  fallback={
                    <div className={badgeClassName}>
                      <Skeleton height={16} width={180} />
                    </div>
                  }
                >
                  <EventFreePlacesBadge
                    event={event}
                    className={badgeClassName}
                  />
                </Suspense>
              </div>
              <div className="flex items-center justify-between w-full gap-x-1 tablet:justify-center">
                <div className="tablet:hidden rounded-full bg-[#f7f1f4] px-3">
                  <PriceDiscountByEventId
                    eventId={eventId}
                    className="font-futura font-semibold text-[18px] tablet:text-[26px] text-[#6b1f2a]"
                  />
                </div>
                <Suspense
                  fallback={
                    <Skeleton
                      height={28}
                      width={140}
                      className="rounded-full"
                    />
                  }
                >
                  <EventButtonSignIn
                    eventId={eventId}
                    noButtonIfAlreadySignIn
                    className="rounded-full"
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-[30px] overflow-hidden hidden laptop:flex w-full flex-wrap items-center justify-between gap-3 border border-[#f0e5ea] bg-white/90 px-4 py-3 shadow-[0_10px_18px_rgba(0,0,0,0.06)]">
          <Suspense
            fallback={
              <div className={badgeClassName}>
                <Skeleton height={16} width={180} />
              </div>
            }
          >
            <EventFreePlacesBadge event={event} className={badgeClassName} />
          </Suspense>
          <Suspense
            fallback={
              <Skeleton height={30} width={140} className="rounded-full" />
            }
          >
            <EventButtonSignIn
              eventId={eventId}
              noButtonIfAlreadySignIn
              className="rounded-full"
            />
          </Suspense>
        </div>
      </div>
    </CardWrapper>
  )
}

const EventCard2Wrapper = (props) => (
  <Suspense fallback={<EventCard2Skeleton {...props} />}>
    <EventCard2 {...props} />
  </Suspense>
)

export default EventCard2Wrapper
