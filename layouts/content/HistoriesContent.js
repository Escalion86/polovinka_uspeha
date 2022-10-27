import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import getNoun, { getNounAges } from '@helpers/getNoun'
import Fab from '@components/Fab'
import CardButtons from '@components/CardButtons'
import reviewsAtom from '@state/atoms/reviewsAtom'
import reviewSelector from '@state/selectors/reviewSelector'
import loadingAtom from '@state/atoms/loadingAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import { CardWrapper } from '@components/CardWrapper'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import historiesAtom from '@state/atoms/historiesAtom'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab'

import { timelineClasses } from '@mui/lab/Timeline'
import { timelineContentClasses } from '@mui/lab/TimelineContent'
import { timelineConnectorClasses } from '@mui/lab/TimelineConnector'
import { timelineDotClasses } from '@mui/lab/TimelineDot'
import { timelineItemClasses } from '@mui/lab/TimelineItem'
import { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent'
import formatDateTime from '@helpers/formatDateTime'
import { UserItem, UserItemFromId } from '@components/ItemCards'
import { SelectEventList, SelectUserList } from '@components/SelectItemList'
import {
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material'
import SortingButtonMenu from '@components/SortingButtonMenu'
import { useState } from 'react'
import ContentHeader from '@components/ContentHeader'
import getDaysBetween from '@helpers/getDaysBetween'
import getHoursBetween from '@helpers/getHoursBetween'
import eventsAtom from '@state/atoms/eventsAtom'
import EventStatusToggleButtons from '@components/IconToggleButtons/EventStatusToggleButtons'
import isEventExpiredFunc from '@helpers/isEventExpired'
import isEventActiveFunc from '@helpers/isEventActive'
import isEventCanceledFunc from '@helpers/isEventCanceled'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import { EVENT_USER_STATUSES } from '@helpers/constants'

// const ReviewCard = ({ reviewId }) => {
//   const modalsFunc = useRecoilValue(modalsFuncAtom)
//   const review = useRecoilValue(reviewSelector(reviewId))
//   const loading = useRecoilValue(loadingAtom('review' + reviewId))
//   const itemFunc = useRecoilValue(itemsFuncAtom)

//   return (
//     <CardWrapper
//       loading={loading}
//       onClick={() => modalsFunc.review.edit(review._id)}
//       flex={false}
//       showOnSite={review.showOnSite}
//     >
//       <div className="flex">
//         <div className="flex-1 px-2 py-1 text-xl font-bold">
//           {review.author}
//           {review.authorAge ? ', ' + getNounAges(review.authorAge) : ''}
//         </div>
//         <CardButtons
//           item={review}
//           typeOfItem="review"
//           showOnSiteOnClick={() => {
//             itemFunc.review.set({
//               _id: review._id,
//               showOnSite: !review.showOnSite,
//             })
//           }}
//         />
//       </div>
//       <div className="px-2 py-1">{review.review}</div>
//     </CardWrapper>
//   )
// }

const dotColors = {
  add: 'success',
  delete: 'error',
}

const EventUsersInTimeLine = ({ createdAt, eventUsers }) => {
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
              />
              <EventUsersInTimeLine
                createdAt={history.createdAt}
                eventUsers={participants}
              />
              <EventUsersInTimeLine
                createdAt={history.createdAt}
                eventUsers={reserved}
              />
              <EventUsersInTimeLine
                createdAt={history.createdAt}
                eventUsers={baned}
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

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      // width: 250,
    },
  },
}

const HistoriesContent = () => {
  const histories = useRecoilValue(historiesAtom)
  const [periodHours, setPeriodHours] = useState(24)
  const events = useRecoilValue(eventsAtom)
  const [filter, setFilter] = useState({
    status: {
      active: true,
      finished: false,
      canceled: false,
    },
  })

  const eventsHistories = {}
  // const eventsResults = {}
  histories.forEach((history) => {
    if (getHoursBetween(history.createdAt) > periodHours) return

    const eventId = history.data[0].eventId
    const event = events.find((event) => event._id === eventId)
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

    if (!eventsHistories[eventId]) eventsHistories[eventId] = []
    eventsHistories[eventId].push(history)
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
            <FormControl
              sx={{ mt: 1, mb: 0.5, width: 160 }}
              size="small"
              margin="none"
            >
              <InputLabel id="demo-multiple-name-label">Период</InputLabel>
              <Select
                value={periodHours}
                onChange={(e) => setPeriodHours(e.target.value)}
                input={<OutlinedInput label="Период" />}
                MenuProps={MenuProps}
              >
                <MenuItem value={1}>1 час</MenuItem>
                <MenuItem value={2}>2 часа</MenuItem>
                <MenuItem value={3}>3 часа</MenuItem>
                <MenuItem value={6}>6 часов</MenuItem>
                <MenuItem value={12}>12 часов</MenuItem>
                <MenuItem value={24}>Сутки</MenuItem>
                <MenuItem value={48}>2 суток</MenuItem>
                <MenuItem value={72}>3 суток</MenuItem>
                <MenuItem value={168}>Неделю</MenuItem>
                <MenuItem value={336}>2 недели</MenuItem>
                <MenuItem value={999999}>За все время</MenuItem>
              </Select>
            </FormControl>
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

export default HistoriesContent
