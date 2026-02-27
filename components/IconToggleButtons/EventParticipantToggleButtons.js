import { useAtomValue } from 'jotai'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'

const EventParticipantToggleButtons = ({ value, onChange, noClosed }) => {
  const windowDimensionsNum = useAtomValue(windowDimensionsNumSelector)

  return (
    <ButtonGroup
      size={windowDimensionsNum < 2 ? 'small' : undefined}
      className="text-white"
    >
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
        color="inherit"
        sx={{
          backgroundColor: value.participant ? '#6b1f2a' : 'transparent',
          color: value.participant ? '#ffffff' : '#6b1f2a',
          borderColor: '#6b1f2a',
          '&:hover': {
            backgroundColor: value.participant ? '#5b1722' : 'transparent',
            borderColor: '#5b1722',
            color: value.participant ? '#ffffff' : '#5b1722',
          },
        }}
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
        color="inherit"
        sx={{
          backgroundColor: value.notParticipant ? '#8dcff2' : 'transparent',
          color: value.notParticipant ? '#ffffff' : '#8dcff2',
          borderColor: '#8dcff2',
          '&:hover': {
            backgroundColor: value.notParticipant ? '#7fc3ea' : 'transparent',
            borderColor: '#7fc3ea',
            color: value.notParticipant ? '#ffffff' : '#7fc3ea',
          },
        }}
      >
        Не записан
      </Button>
    </ButtonGroup>
  )
}

export default EventParticipantToggleButtons
