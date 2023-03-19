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
            participant: !value.participant,
            notParticipant:
              !value.notParticipant || value.participant
                ? value.participant
                : true,
          })
        }
        variant={value.participant ? 'contained' : 'outlined'}
        color="green"
        className={value.participant ? 'text-white' : 'text-green-400'}
      >
        Записан
      </Button>
      <Button
        onClick={() =>
          onChange({
            participant:
              value.participant || !value.notParticipant
                ? value.participant
                : true,
            notParticipant: !value.notParticipant,
          })
        }
        variant={value.notParticipant ? 'contained' : 'outlined'}
        color="red"
        className={value.notParticipant ? 'text-white' : 'text-red-400'}
      >
        Не записан
      </Button>
    </ButtonGroup>
  )
}

export default EventParticipantToggleButtons
