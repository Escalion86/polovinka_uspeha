import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faAdd } from '@fortawesome/free-solid-svg-icons/faAdd'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown'
import { faRefresh } from '@fortawesome/free-solid-svg-icons/faRefresh'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import cn from 'classnames'
import { m } from 'framer-motion'
import { useState } from 'react'
import UserNameById from './UserNameById'

const HistoryItem = ({
  action,
  changes,
  createdAt,
  userId,
  KeyValueItem,
  keys,
  onClickRedo,
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
                arrayOfChanges.length > 0 ? 'border-gray-300 border-t-1' : ''
              )}
            >
              <div className="flex-1 font-bold">{keys[key] ?? key}</div>
              <m.div
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
              </m.div>
            </div>
          )
        })()
      )
    }
  }

  return (
    <div className="overflow-hidden border border-gray-500 rounded-lg hover:bg-gray-100">
      <div className="flex items-center border-b border-gray-500 gap-x-2">
        <div
          className={cn(
            'flex items-center self-stretch justify-center p-1 duration-300 border-r border-gray-500',
            onClickRedo
              ? 'cursor-pointer hover:bg-green-500 hover:text-white'
              : '',
            action === 'add'
              ? 'text-green-600'
              : action === 'delete'
                ? 'text-red-600'
                : 'text-blue-600'
          )}
          onClick={onClickRedo}
        >
          <FontAwesomeIcon
            className={cn('w-5', action === 'add' ? 'h-5' : 'h-4')}
            icon={
              action === 'add'
                ? faAdd
                : action === 'delete'
                  ? faTrash
                  : faRefresh
            }
          />
        </div>
        <div className="flex items-center flex-1 py-1 pr-1 gap-x-2">
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
                'cursor-pointer w-6 self-stretch duration-300 transition-transform flex items-center justify-center',
                {
                  'rotate-180': isCollapsed,
                }
              )}
              onClick={() => {
                setIsCollapsed((state) => !state)
              }}
            >
              <FontAwesomeIcon icon={faAngleDown} size="lg" />
            </div>
          )}
        </div>
      </div>
      {(action === 'update' || action === 'updete') && (
        <div className="px-1">{arrayOfChanges}</div>
      )}
    </div>
  )
}

export default HistoryItem
