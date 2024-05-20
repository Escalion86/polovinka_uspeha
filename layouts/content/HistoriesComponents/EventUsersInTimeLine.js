'use client'

import { SelectUserList } from '@components/SelectItemList'
import { EVENT_USER_STATUSES } from '@helpers/constants'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import React from 'react'
import UserNameById from '@components/UserNameById'

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

export default EventUsersInTimeLine
