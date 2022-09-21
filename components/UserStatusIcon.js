import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Tooltip from './Tooltip'
import Image from 'next/image'

const UserStatusIcon = ({ status }) => {
  switch (status) {
    case 'novice':
      return (
        <Tooltip title="Новичок">
          <FontAwesomeIcon className="w-6 h-5 text-green-400" icon={faUser} />
        </Tooltip>
      )
    case 'member':
      return (
        <Tooltip title="Участник клуба">
          <div className="w-6 h-6">
            <Image src="/img/svg_icons/medal.svg" width="24" height="24" />
          </div>
        </Tooltip>
      )
    case 'ban':
      return (
        <Tooltip title="Забанен">
          <div className="w-6 h-6">
            <Image src="/img/svg_icons/ban.svg" width="24" height="24" />
          </div>
        </Tooltip>
      )
    default:
      return (
        <Tooltip title="Новичок">
          <FontAwesomeIcon className="w-6 h-5 text-green-400" icon={faUser} />
        </Tooltip>
      )
  }
}

export default UserStatusIcon
