import React from 'react'
import { Button, ButtonGroup } from '@mui/material'
import {
  faGenderless,
  faMars,
  faVenus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const GenderToggleButtons = ({ value, onChange }) => {
  return (
    <ButtonGroup>
      <Button
        onClick={() =>
          onChange({
            famale:
              !value.male || value.famale || value.null ? value.famale : true,
            male: !value.male,
            null: value.null,
          })
        }
        variant={value.male ? 'contained' : 'outlined'}
        color="blue"
        className={value.male ? 'text-white' : 'text-blue-400'}
      >
        <FontAwesomeIcon className="w-6 h-6" icon={faMars} />
      </Button>
      <Button
        onClick={() =>
          onChange({
            male: value.male || !value.famale || value.null ? value.male : true,
            famale: !value.famale,
            null: value.null,
          })
        }
        variant={value.famale ? 'contained' : 'outlined'}
        color="red"
        className={value.famale ? 'text-white' : 'text-red-400'}
      >
        {/* <div
          // className={cn(
          //   'w-8 flex justify-center items-center',
          //   userGender ? 'bg-' + userGender.color : 'bg-gray-400'
          // )}
        > */}
        <FontAwesomeIcon className="w-6 h-6" icon={faVenus} />
      </Button>
      <Button
        onClick={() =>
          onChange({
            male: value.male || value.famale || !value.null ? value.male : true,
            famale: value.famale,
            null: !value.null,
          })
        }
        variant={value.null ? 'contained' : 'outlined'}
        color="gray"
        className={value.null ? 'text-white' : 'text-gray-400'}
      >
        {/* <div
          // className={cn(
          //   'w-8 flex justify-center items-center',
          //   userGender ? 'bg-' + userGender.color : 'bg-gray-400'
          // )}
        > */}
        <FontAwesomeIcon className="w-6 h-6" icon={faGenderless} />
      </Button>
    </ButtonGroup>
  )
}

export default GenderToggleButtons
