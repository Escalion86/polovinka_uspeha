import React from 'react'
import { Button, ButtonGroup } from '@mui/material'

const EventStatusToggleButtons = ({ value, onChange }) => {
  return (
    <ButtonGroup>
      <Button
        onClick={() =>
          onChange({
            active: !value.active,
            finished:
              !value.active || value.finished || value.canceled
                ? value.finished
                : true,
            canceled: value.canceled,
          })
        }
        variant={value.active ? 'contained' : 'outlined'}
        color="blue"
        className={value.active ? 'text-white' : 'text-blue-400'}
      >
        Предстоят
      </Button>
      <Button
        onClick={() =>
          onChange({
            active:
              value.active || !value.finished || value.canceled
                ? value.active
                : true,
            finished: !value.finished,
            canceled: value.canceled,
          })
        }
        variant={value.finished ? 'contained' : 'outlined'}
        color="green"
        className={value.finished ? 'text-white' : 'text-green-400'}
      >
        Завершены
      </Button>
      <Button
        onClick={() =>
          onChange({
            active:
              value.active || value.finished || !value.canceled
                ? value.active
                : true,
            finished: value.finished,
            canceled: !value.canceled,
          })
        }
        variant={value.canceled ? 'contained' : 'outlined'}
        color="red"
        className={value.canceled ? 'text-white' : 'text-red-400'}
      >
        Отменены
      </Button>
    </ButtonGroup>
  )
}

export default EventStatusToggleButtons
