import ComboBox from '@components/ComboBox'
import ContentHeader from '@components/ContentHeader'
import EventStatusToggleButtons from '@components/IconToggleButtons/EventStatusToggleButtons'
import { SelectEventList, SelectUserList } from '@components/SelectItemList'
import { EVENT_USER_STATUSES } from '@helpers/constants'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import getHoursBetween from '@helpers/getHoursBetween'
import isEventActiveFunc from '@helpers/isEventActive'
import isEventCanceledFunc from '@helpers/isEventCanceled'
import isEventExpiredFunc from '@helpers/isEventExpired'
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
import { useRecoilValue } from 'recoil'
import { historiesOfEventUsersSelector } from '@state/atoms/historiesOfEventUsersAtom'
import LoadingSpinner from '@components/LoadingSpinner'
import UserNameById from '@components/UserNameById'

const dotColors = {
  add: 'success',
  delete: 'error',
}

const EventUsersInTimeLine = ({ createdAt, eventUsers, creatorId }) => {
  if (!eventUsers || eventUsers.length === 0) return null
  const eventUserStatus = EVENT_USER_STATUSES.find(
    (eventUserStatus) => eventUserStatus.value === eventUsers[0].status
  )

  const [createdAtDate, createdAtTime] = dateToDateTimeStr(
    createdAt,
    true,
    false
  )

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-1 mb-0.5">
        <span
          className={
            'bg-' +
            eventUserStatus.color +
            ' rounded px-1 text-sm flex items-center'
          }
        >
          {eventUserStatus.name}
        </span>
        <div className="flex text-sm flex-nowrap tablet:text-base gap-x-1">
          <span className="whitespace-nowrap">{createdAtDate}</span>
          <span className="font-bold">{createdAtTime}</span>
        </div>
        {creatorId !== eventUsers[0].userId && (
          <div className="flex justify-end flex-1 text-sm text-danger">
            <UserNameById
              userId={creatorId}
              noWrap
              className="text-right whitespace-nowrap"
            />
          </div>
        )}
        {/* <span>{formatDateTime(createdAt, false, false, false, false)}</span> */}
      </div>
      <SelectUserList
        // label="Участники Мужчины"
        usersId={eventUsers.map((eventUser) => eventUser.userId)}
        showCounter={false}
        readOnly
      />
    </>
  )
}

const HistoriesOfEvent = ({ histories }) => {
  return (
    <Timeline
      className="pt-1 pb-0 pl-2 pr-1 -mt-1 bg-gray-100 border-b border-l border-r border-gray-600 rounded-b"
      // sx={{
      //   [`& .${timelineOppositeContentClasses.root}`]: {
      //     flex: 0.2,
      //   },
      // }}
      // style={{ padding: 0 }}
      sx={{
        // [`& .${timelineClasses.root}`]: {
        //   padding: '0px !important',
        //   margin: 0,
        // },
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
          // paddingTop: 10,
        },
        // [`& .${timelineItemClasses.root}`]: {
        //   maxHeight: 8,
        // },
        // [`& .${timelineContentClasses.root}`]: {
        //   paddingRight: 0,
        // },
        // [`& .${timelineDotClasses.root}:before`]: {
        //   padding: 0,
        // },
        // [`& .${timelineConnectorClasses.root}`]: {
        //   marginBottom: -1.4,
        // },
      }}
    >
      {histories.map((history, index) => {
        const creatorId = history.userId

        const participants = history.data.filter(
          (eventUser) => eventUser.status === 'participant'
        )
        const reserved = history.data.filter(
          (eventUser) => eventUser.status === 'reserve'
        )
        const baned = history.data.filter(
          (eventUser) => eventUser.status === 'ban'
        )
        const assistants = history.data.filter(
          (eventUser) => eventUser.status === 'assistant'
        )

        return (
          <TimelineItem key={history._id}>
            {/* <TimelineOppositeContent color="text.secondary">
      {formatDateTime(history.createdAt, false, false, false, false)}
    </TimelineOppositeContent> */}
            <TimelineSeparator>
              <TimelineDot color={dotColors[history.action]}>
                <div className="flex items-center justify-center w-3 h-3 text-sm tablet:w-4 tablet:h-4 tablet:text-base">
                  {history.data.length}
                </div>
              </TimelineDot>
              {index < histories.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent
              style={{
                paddingRight: 0,
                paddingLeft: 8,
              }}
            >
              <EventUsersInTimeLine
                createdAt={history.createdAt}
                eventUsers={assistants}
                creatorId={creatorId}
              />
              <EventUsersInTimeLine
                createdAt={history.createdAt}
                eventUsers={participants}
                creatorId={creatorId}
              />
              <EventUsersInTimeLine
                createdAt={history.createdAt}
                eventUsers={reserved}
                creatorId={creatorId}
              />
              <EventUsersInTimeLine
                createdAt={history.createdAt}
                eventUsers={baned}
                creatorId={creatorId}
              />
            </TimelineContent>
            {/* <TimelineContent
            style={{
              paddingRight: 0,
              paddingLeft: 8,
            }}
          >
            <div>
              {formatDateTime(history.createdAt, false, false, false, false)}
              {history.data.find((eventUser) => eventUser.userId)}
            </div>
            <SelectUserList
              // label="Участники Мужчины"
              usersId={history.data.map((eventUser) => eventUser.userId)}
              showCounter={false}
              readOnly
            />
          </TimelineContent> */}
          </TimelineItem>
        )
      })}
    </Timeline>
  )
}

const HistoriesOfEvents = ({ eventsHistories }) => {
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
      {Object.keys(eventsHistories).map((eventId, index) => {
        const data = eventsHistories[eventId]

        const [firstCreatedAtDate, firstCreatedAtTime] = dateToDateTimeStr(
          data[0].createdAt,
          true,
          false
        )

        const [lastCreatedAtDate, lastCreatedAtTime] = dateToDateTimeStr(
          data[data.length - 1].createdAt,
          true,
          false
        )

        let eventResult = 0
        for (let i = 0; i < data.length; i++) {
          eventResult =
            eventResult +
            (data[i].action === 'add' ? 1 : -1) * data[i].data.length
        }

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
              {index < Object.keys(eventsHistories).length - 1 && (
                <TimelineConnector />
              )}
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

              <SelectEventList eventsId={[eventId]} readOnly />
              {/* <div className="h-auto overflow-hidden"> */}
              <HistoriesOfEvent histories={data} />
              {/* </div> */}
            </TimelineContent>
          </TimelineItem>
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
  const histories = useRecoilValue(historiesOfEventUsersSelector)
  const events = useRecoilValue(eventsAtom)

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
    if (
      !(
        (isEventActive && filter.status.finished && isEventExpired) ||
        (isEventActive && filter.status.active && !isEventExpired) ||
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
          <div className="flex flex-wrap items-center justify-center gap-y-0.5 gap-x-2">
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
