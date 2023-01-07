import React from 'react'
import { Button, ButtonGroup } from '@mui/material'
import {
  faBan,
  faGenderless,
  faMars,
  faUser,
  faVenus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'

const StatusUserToggleButtons = ({ value, onChange }) => {
  return (
    <ButtonGroup>
      <Button
        onClick={() =>
          onChange({
            novice:
              !value.novice && value.member && !value.ban ? true : value.novice,
            member: !value.member,
            ban: value.ban,
          })
        }
        variant={value.member ? 'contained' : 'outlined'}
        color="blue"
        className={value.member ? 'text-white' : 'text-blue-400'}
      >
        <div className="w-6 h-6">
          <Image src="/img/svg_icons/medal.svg" width="24" height="24" />
        </div>
        {/* <FontAwesomeIcon className="w-6 h-6" icon={faGenderless} /> */}
      </Button>
      <Button
        onClick={() =>
          onChange({
            novice: !value.novice,
            member:
              value.novice && !value.member && !value.ban ? true : value.member,
            ban: value.ban,
          })
        }
        variant={value.novice ? 'contained' : 'outlined'}
        color="green"
        className={value.novice ? 'text-white' : 'text-green-400'}
      >
        {/* <div
          // className={cn(
          //   'w-8 flex justify-center items-center',
          //   userGender ? 'bg-' + userGender.color : 'bg-gray-400'
          // )}
        > */}
        <FontAwesomeIcon className="w-6 h-6" icon={faUser} />
      </Button>
      <Button
        onClick={() =>
          onChange({
            novice:
              !value.member && !value.novice && value.ban ? true : value.novice,
            member: value.member,
            ban: !value.ban,
          })
        }
        variant={value.ban ? 'contained' : 'outlined'}
        color="red"
        className={value.ban ? 'text-white' : 'text-red-400'}
      >
        {/* <div
          // className={cn(
          //   'w-8 flex justify-center items-center',
          //   userGender ? 'bg-' + userGender.color : 'bg-gray-400'
          // )}
        > */}
        <FontAwesomeIcon className="w-6 h-6" icon={faBan} />
      </Button>
    </ButtonGroup>
  )
}

export default StatusUserToggleButtons
