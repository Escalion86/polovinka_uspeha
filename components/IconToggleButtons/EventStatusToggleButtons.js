import React from 'react'
import { Button, ButtonGroup } from '@mui/material'
import { useRecoilValue } from 'recoil'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import isLoggedUserModerSelector from '@state/selectors/isLoggedUserModerSelector'

const EventStatusToggleButtons = ({ value, onChange, noClosed }) => {
  const isLoggedUserModer = useRecoilValue(isLoggedUserModerSelector)
  const windowDimensionsNum = useRecoilValue(windowDimensionsNumSelector)
  return (
    <ButtonGroup size={windowDimensionsNum < 2 ? 'small' : undefined}>
      <Button
        onClick={() =>
          onChange({
            active: !value.active,
            finished:
              !value.active || value.finished || value.canceled || value.closed
                ? value.finished
                : true,
            closed: value.closed,
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
              value.active || !value.finished || value.canceled || value.closed
                ? value.active
                : true,
            finished: !value.finished,
            closed: value.closed,
            canceled: value.canceled,
          })
        }
        variant={value.finished ? 'contained' : 'outlined'}
        color="green"
        className={value.finished ? 'text-white' : 'text-green-400'}
      >
        Завершены
      </Button>
      {!noClosed && isLoggedUserModer && (
        <Button
          onClick={() =>
            onChange({
              active:
                value.active ||
                value.finished ||
                value.canceled ||
                !value.closed
                  ? value.active
                  : true,
              finished: value.finished,
              closed: !value.closed,
              canceled: value.canceled,
            })
          }
          variant={value.closed ? 'contained' : 'outlined'}
          color="green"
          className={value.closed ? 'text-white' : 'text-green-400'}
        >
          Закрыты
        </Button>
      )}
      <Button
        onClick={() =>
          onChange({
            active:
              value.active || value.finished || !value.canceled || value.closed
                ? value.active
                : true,
            closed: value.closed,
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
