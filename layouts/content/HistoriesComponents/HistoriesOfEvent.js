'use client'

import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab'
import { timelineItemClasses } from '@mui/lab/TimelineItem'
import React from 'react'
import EventUsersInTimeLine from './EventUsersInTimeLine'
import cn from 'classnames'

const dotColors = {
  add: 'success',
  delete: 'error',
}

const HistoriesOfEvent = ({ histories, className }) => {
  return (
    <Timeline
      className={cn('pt-1 pb-0 pl-2 pr-1', className)}
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

export default HistoriesOfEvent
