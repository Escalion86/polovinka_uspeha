import {
  faAdd,
  faAngleDown,
  faRefresh,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import cn from 'classnames'
import { motion } from 'framer-motion'
import { useState } from 'react'
import UserNameById from './UserNameById'

const HistoryItem = ({
  action,
  changes,
  createdAt,
  userId,
  KeyValueItem,
  keys,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const [createdAtDate, createdAtTime] = dateToDateTimeStr(
    createdAt,
    true,
    false
  )

  const arrayOfChanges = []
  for (const [key, value] of Object.entries(changes)) {
    if (
      ![
        '_id',
        'createdAt',
        'updatedAt',
        '__v',
        'lastActivityAt',
        'prevActivityAt',
      ].includes(key)
    ) {
      arrayOfChanges.push(
        (() => {
          return (
            <div
              key={key}
              className={cn(
                'flex flex-col gap-x-1',
                'border-gray-300 border-t-1'
              )}
            >
              <div className="flex-1 font-bold">{keys[key] ?? key}</div>
              <motion.div
                className="overflow-hidden"
                initial={{ height: 0 }}
                animate={{ height: isCollapsed ? 0 : 'auto' }}
              >
                <div className="flex mt-1 gap-x-1">
                  <div className="italic font-bold border-r-2 w-13 text-danger min-w-13 border-danger">
                    Было
                  </div>
                  <KeyValueItem objKey={key} value={value.old} />
                </div>
                <div className="flex pb-1 mt-1 gap-x-1">
                  <div className="italic font-bold border-r-2 w-13 text-success min-w-13 border-success">
                    Стало
                  </div>
                  <KeyValueItem objKey={key} value={value.new} />
                </div>
              </motion.div>
            </div>
          )
        })()
      )
    }
  }

  return (
    <div
      className="px-1 border border-gray-500 rounded-lg cursor-pointer hover:bg-gray-100"
      onClick={() => {
        setIsCollapsed((state) => !state)
      }}
    >
      <div className="flex items-center py-1 gap-x-2">
        <FontAwesomeIcon
          className={cn('w-5', action === 'add' ? 'h-5' : 'h-4')}
          icon={
            action === 'add' ? faAdd : action === 'delete' ? faTrash : faRefresh
          }
          color={
            action === 'add' ? 'green' : action === 'delete' ? 'red' : 'blue'
          }
        />
        <div className="flex flex-col flex-1 gap-y-0.5 gap-x-2 tablet:items-center tablet:flex-row">
          <div className="flex items-center gap-x-2">
            <div className="flex text-sm flex-nowrap tablet:text-base gap-x-1">
              <span className="whitespace-nowrap">{createdAtDate}</span>
              <span className="font-bold">{createdAtTime}</span>
            </div>
          </div>
          <UserNameById
            userId={userId}
            className="flex-1 font-semibold text-general"
            thin
            trunc={1}
          />
        </div>
        {(action === 'update' || action === 'updete') && (
          <div
            className={cn(
              'w-4 duration-300 transition-transform flex items-center justify-center',
              {
                'rotate-180': isCollapsed,
              }
            )}
          >
            <FontAwesomeIcon icon={faAngleDown} size="lg" />
          </div>
        )}
      </div>
      {(action === 'update' || action === 'updete') && (
        <div>{arrayOfChanges}</div>
      )}
    </div>
  )
}

export default HistoryItem
