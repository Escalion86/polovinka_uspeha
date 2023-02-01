import { faQuestion, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Tooltip from './Tooltip'
import Image from 'next/image'
import cn from 'classnames'

const UserStatusIcon = ({ status, size }) => {
  switch (status) {
    case 'novice':
      return (
        <Tooltip title="Новичок">
          <FontAwesomeIcon
            className={cn(
              size === 'xs' ? 'min-w-3 w-3 h-3' : 'min-w-6 w-6 h-5',
              'text-green-400'
            )}
            icon={faUser}
          />
        </Tooltip>
      )
    case 'member':
      return (
        <Tooltip title="Участник клуба">
          <div
            className={cn(
              size === 'xs' ? 'min-w-3 w-3 h-3' : 'min-w-6 w-6 h-6'
            )}
          >
            <Image
              src="/img/svg_icons/medal.svg"
              width={size === 'xs' ? '12' : '24'}
              height={size === 'xs' ? '12' : '24'}
            />
          </div>
        </Tooltip>
      )
    case 'ban':
      return (
        <Tooltip title="Забанен">
          <div
            className={cn(
              size === 'xs' ? 'min-w-3 w-3 h-3' : 'min-w-6 w-6 h-6'
            )}
          >
            <Image
              src="/img/svg_icons/ban.svg"
              width={size === 'xs' ? '12' : '24'}
              height={size === 'xs' ? '12' : '24'}
            />
          </div>
        </Tooltip>
      )
    default:
      return (
        <Tooltip title="Статус не указан">
          <FontAwesomeIcon
            className={cn(
              size === 'xs' ? 'min-w-3 w-3 h-3' : 'min-w-6 w-6 h-5',
              'text-danger'
            )}
            icon={faQuestion}
          />
        </Tooltip>
      )
  }
}

export default UserStatusIcon
