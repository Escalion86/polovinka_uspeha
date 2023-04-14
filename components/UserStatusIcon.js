import { faQuestion, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Tooltip from './Tooltip'
import Image from 'next/image'
import cn from 'classnames'

const UserStatusIcon = ({ status, size }) => {
  var numSize
  switch (size) {
    case 'xs':
      numSize = 3
      break
    case 's':
      numSize = 4
      break
    case 'm':
      numSize = 5
      break
    case 'l':
      numSize = 6
      break
    default:
      numSize = 6
  }

  switch (status) {
    case 'novice':
      return (
        <Tooltip title="Новичок">
          <div
            className={`flex items-center justify-center min-w-${
              numSize + 1
            } w-${numSize + 1} h-${numSize + 1}`}
          >
            <FontAwesomeIcon
              className={cn(
                `min-w-${numSize} w-${numSize} h-${numSize}`,
                'text-green-400'
              )}
              icon={faUser}
            />
          </div>
        </Tooltip>
      )
    case 'member':
      return (
        <Tooltip title="Участник клуба">
          <div
            className={`flex items-center justify-center min-w-${
              numSize + 1
            } w-${numSize + 1} h-${numSize + 1}`}
          >
            <Image
              src="/img/svg_icons/medal.svg"
              width={numSize * 4}
              height={(numSize + 1) * 4}
            />
          </div>
        </Tooltip>
      )
    case 'ban':
      return (
        <Tooltip title="Забанен">
          <div
            className={`flex items-center justify-center min-w-${
              numSize + 1
            } w-${numSize + 1} h-${numSize + 1}`}
          >
            <Image
              // className={`min-w-${numSize} w-${numSize} h-${numSize}`}
              src="/img/svg_icons/ban.svg"
              width={numSize * 4}
              height={numSize * 4}
            />
          </div>
        </Tooltip>
      )
    default:
      return (
        <Tooltip title="Статус не указан">
          <div
            className={`flex items-center justify-center min-w-${
              numSize + 1
            } w-${numSize + 1} h-${numSize + 1}`}
          >
            <FontAwesomeIcon
              className={cn(
                `min-w-${numSize} w-${numSize} h-${numSize}`,
                'text-danger'
              )}
              icon={faQuestion}
            />
          </div>
        </Tooltip>
      )
  }
}

export default UserStatusIcon
