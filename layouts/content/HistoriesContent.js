'use client'

import ComboBox from '@components/ComboBox'
import ContentHeader from '@components/ContentHeader'
import EventStatusToggleButtons from '@components/IconToggleButtons/EventStatusToggleButtons'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import getHoursBetween from '@helpers/getHoursBetween'
import isEventActiveFunc from '@helpers/isEventActive'
import isEventCanceledFunc from '@helpers/isEventCanceled'
import isEventExpiredFunc from '@helpers/isEventExpired'
import isEventClosedFunc from '@helpers/isEventClosed'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab'
import { timelineItemClasses } from '@mui/lab/TimelineItem'
import eventsAtom from '@state/atoms/eventsAtom'
import React, { Suspense, useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import historiesOfEventUsersAtom from '@state/atoms/historiesOfEventUsersAtom'
import LoadingSpinner from '@components/LoadingSpinner'
import { EventItemFromId } from '@components/ItemCards'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import cn from 'classnames'
import modalsFuncAtom from '@state/atoms/modalsFuncAtom'
import HistoriesOfEvent from './HistoriesComponents/HistoriesOfEvent'

const dotColors = {
  add: 'success',
  delete: 'error',
}

const HistoryEventItem = ({ data, eventId, isLast }) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [firstCreatedAtDate, firstCreatedAtTime] = useMemo(
    () => dateToDateTimeStr(data[0].createdAt, true, false),
    [data]
  )

  const [lastCreatedAtDate, lastCreatedAtTime] = useMemo(
    () => dateToDateTimeStr(data[data.length - 1].createdAt, true, false),
    [data]
  )

  const eventResult = useMemo(
    () =>
      data.reduce((sum, event) => {
        return sum + (event.action === 'add' ? 1 : -1) * event.data.length
      }, 0),
    [data]
  )

  return (
    <TimelineItem key={eventId}>
      <TimelineSeparator>
        <TimelineDot
          // style={{ paddingLeft: 0, paddingRight: 0 }}
          color={
            eventResult === 0
              ? undefined
              : dotColors[eventResult > 0 ? 'add' : 'delete']
          }
        >
          <div className="flex items-center justify-center w-3 h-3 text-sm tablet:w-4 tablet:h-4 tablet:text-base">
            {Math.abs(eventResult)}
          </div>
        </TimelineDot>
        {!isLast && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent
        style={{
          paddingRight: 0,
          paddingLeft: 8,
        }}
      >
        <div className="flex flex-wrap text-sm tablet:text-base gap-x-1">
          <div className="flex gap-x-1">
            <span>{firstCreatedAtDate}</span>
            <span className="font-bold">{firstCreatedAtTime}</span>
            {(lastCreatedAtDate !== firstCreatedAtDate ||
              lastCreatedAtTime !== firstCreatedAtTime) && <span>-</span>}
          </div>
          {(lastCreatedAtDate !== firstCreatedAtDate ||
            lastCreatedAtTime !== firstCreatedAtTime) && (
            <div className="flex gap-x-1">
              {lastCreatedAtDate !== firstCreatedAtDate && (
                <span>{lastCreatedAtDate}</span>
              )}
              <span className="font-bold">{lastCreatedAtTime}</span>
            </div>
          )}
        </div>
        {/* <SelectEventList eventsId={[eventId]} readOnly /> */}
        {/* <div className="h-auto overflow-hidden"> */}
        <div className="flex flex-col items-stretch overflow-hidden bg-gray-200 border border-gray-700 rounded-sm">
          <div className="flex items-stretch overflow-hidden -mb-[1px] border-b border-gray-700 flex-nowrap rouded-b">
            <EventItemFromId
              eventId={eventId}
              noBorder
              onClick={() => modalsFunc.event.view(eventId)}
              // className="rounded-t last:border-0"
            />
            <div
              className={cn(
                'cursor-pointer hover:bg-gray-300 duration-300 flex items-center justify-center w-7 tablet:w-8 px-1 border-l border-gray-700',
                {
                  // 'rotate-180': isCollapsed,
                }
              )}
              onClick={() => setIsCollapsed((state) => !state)}
            >
              <div
                className={cn('w-4 duration-300 transition-transform', {
                  'rotate-180': isCollapsed,
                })}
              >
                <FontAwesomeIcon icon={faAngleDown} size="lg" />
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              transition: 'grid-template-rows 0.3s ease-in-out',
              gridTemplateRows: isCollapsed ? '0fr' : '1fr',
            }}
          >
            <div className="overflow-hidden">
              <HistoriesOfEvent histories={data} />
            </div>
          </div>
        </div>
      </TimelineContent>
    </TimelineItem>
  )
}

const HistoriesOfEvents = ({ eventsHistories }) => {
  const eventsHistoriesKeys = Object.keys(eventsHistories)
  return (
    <Timeline
      style={{ paddingLeft: 8, paddingRight: 8 }}
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
        // [`& .${timelineContentClasses.root}`]: {
        //   paddingRight: 0,
        //   paddingLeft: 1.5,
        // },
      }}
    >
      {eventsHistoriesKeys.map((eventId, index) => {
        const data = eventsHistories[eventId]
        return (
          <HistoryEventItem
            key={eventId}
            data={data}
            eventId={eventId}
            isLast={index >= eventsHistoriesKeys.length - 1}
          />
        )
      })}
    </Timeline>
  )
}

// const ITEM_HEIGHT = 48
// const ITEM_PADDING_TOP = 8
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       // width: 250,
//     },
//   },
// }

const HistoriesContentComponent = () => {
  const histories = useAtomValue(historiesOfEventUsersAtom)
  const events = useAtomValue(eventsAtom)

  const [periodHours, setPeriodHours] = useState(24)

  const eventsUsersHistoriesWithEvent = useMemo(
    () =>
      histories
        .filter(
          ({ schema, createdAt }) =>
            // schema === 'eventsusers' &&
            getHoursBetween(createdAt) < periodHours
        )
        .map((history) => {
          const eventId = history.data[0].eventId
          const event = events.find((event) => event._id === eventId)
          return { ...history, event }
        }),
    [periodHours, histories, events]
  )

  const [filter, setFilter] = useState({
    status: {
      active: true,
      finished: false,
      closed: false,
      canceled: false,
    },
  })

  const eventsHistories = {}
  // const eventsResults = {}
  eventsUsersHistoriesWithEvent.forEach((history, index) => {
    const { event } = history
    if (!event) return
    const isEventExpired = isEventExpiredFunc(event)
    const isEventActive = isEventActiveFunc(event)
    const isEventCanceled = isEventCanceledFunc(event)
    const isEventClosed = isEventClosedFunc(event)
    if (
      !(
        (isEventActive && filter.status.finished && isEventExpired) ||
        (isEventActive && filter.status.active && !isEventExpired) ||
        (isEventClosed && filter.status.closed) ||
        (isEventCanceled && filter.status.canceled)
      )
    )
      return

    if (!eventsHistories[event._id]) eventsHistories[event._id] = []
    eventsHistories[event._id].push(history)
    // eventsResults[eventId] =
    //   (eventsResults[eventId] ?? 0) +
    //   (history.action === 'add' ? 1 : -1) * history.data.length
  })

  return (
    <>
      <ContentHeader>
        <div className="flex flex-wrap items-center justify-start flex-1">
          <div className="flex flex-wrap items-center justify-center gap-y-2.5 gap-x-2">
            <EventStatusToggleButtons
              value={filter.status}
              onChange={(value) =>
                setFilter((state) => ({ ...state, status: value }))
              }
            />
            <ComboBox
              label="Период"
              value={String(periodHours)}
              onChange={(value) => setPeriodHours(Number(value))}
              items={[
                { name: '1 час', value: 1 },
                { name: '2 часа', value: 2 },
                { name: '3 часа', value: 3 },
                { name: '6 часов', value: 6 },
                { name: '12 часов', value: 12 },
                { name: 'Сутки', value: 24 },
                { name: '2 суток', value: 48 },
                { name: '3 суток', value: 72 },
                { name: 'Неделю', value: 168 },
                { name: '2 недели', value: 336 },
                { name: 'Месяц', value: 720 },
                { name: '3 месяца', value: 2160 },
                { name: 'За все время', value: 999999 },
              ]}
              noMargin
              className="mt-1"
            />
          </div>
        </div>
        {/* <div className="flex-1" /> */}
      </ContentHeader>
      <CardListWrapper>
        <HistoriesOfEvents eventsHistories={eventsHistories} />
      </CardListWrapper>
    </>
  )
}

const HistoriesContent = (props) => (
  <Suspense
    fallback={
      <div className="z-10 flex items-center justify-center h-full">
        <LoadingSpinner text="идет загрузка истории...." />
      </div>
    }
  >
    <HistoriesContentComponent {...props} />
  </Suspense>
)

export default HistoriesContent
