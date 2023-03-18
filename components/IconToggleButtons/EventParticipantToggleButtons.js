import React from 'react'
import { Button, ButtonGroup } from '@mui/material'
import { useRecoilValue } from 'recoil'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
// import isLoggedUserModerSelector from '@state/selectors/isLoggedUserModerSelector'

const EventParticipantToggleButtons = ({ value, onChange, noClosed }) => {
  // const isLoggedUserModer = useRecoilValue(isLoggedUserModerSelector)
  const windowDimensionsNum = useRecoilValue(windowDimensionsNumSelector)
  return (
    <ButtonGroup size={windowDimensionsNum < 2 ? 'small' : undefined}>
      <Button
        onClick={() =>
          onChange({
            partisipant: !value.partisipant,
            notPartisipant:
              !value.notPartisipant || value.partisipant
                ? value.partisipant
                : true,
          })
        }
        variant={value.partisipant ? 'contained' : 'outlined'}
        color="green"
        className={value.partisipant ? 'text-white' : 'text-green-400'}
      >
        Записан
      </Button>
      <Button
        onClick={() =>
          onChange({
            partisipant:
              value.partisipant || !value.notPartisipant
                ? value.partisipant
                : true,
            notPartisipant: !value.notPartisipant,
          })
        }
        variant={value.notPartisipant ? 'contained' : 'outlined'}
        color="red"
        className={value.notPartisipant ? 'text-white' : 'text-red-400'}
      >
        Не записан
      </Button>
    </ButtonGroup>
  )
}

export default EventParticipantToggleButtons
