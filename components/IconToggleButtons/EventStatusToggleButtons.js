import { useAtomValue } from 'jotai'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'

const EventStatusToggleButtons = ({
  value,
  onChange,
  noClosed,
  availableButtons,
  labels,
}) => {
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)

  const eventStatusFilterFull = loggedUserActiveRole?.events?.statusFilterFull

  const windowDimensionsNum = useAtomValue(windowDimensionsNumSelector)

  const isButtonVisible = (button) =>
    !availableButtons || availableButtons.includes(button)

  const getLabel = (button, defaultLabel) =>
    labels?.[button] ?? defaultLabel

  return (
    <ButtonGroup
      size={windowDimensionsNum < 2 ? 'small' : undefined}
      className="text-white"
    >
      {isButtonVisible('active') && (
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
          className={value.active ? '' : 'text-blue-400'}
        >
          {getLabel('active', 'Предстоят')}
        </Button>
      )}
      {isButtonVisible('finished') && (
        <Button
          onClick={() =>
            onChange({
              active:
                value.active ||
                !value.finished ||
                value.canceled ||
                value.closed
                  ? value.active
                  : true,
              finished: !value.finished,
              closed: value.closed,
              canceled: value.canceled,
            })
          }
          variant={value.finished ? 'contained' : 'outlined'}
          color="green"
          className={value.finished ? '' : 'text-green-400'}
        >
          {getLabel('finished', 'Завершены')}
        </Button>
      )}
      {!noClosed && eventStatusFilterFull && isButtonVisible('closed') && (
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
          className={value.closed ? '' : 'text-green-400'}
        >
          {getLabel('closed', 'Закрыты')}
        </Button>
      )}
      {isButtonVisible('canceled') && (
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
          className={value.canceled ? '' : 'text-red-400'}
        >
          {getLabel('canceled', 'Отменены')}
        </Button>
      )}
    </ButtonGroup>
  )
}

export default EventStatusToggleButtons
