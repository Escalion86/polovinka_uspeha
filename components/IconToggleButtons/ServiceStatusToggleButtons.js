import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import { useRecoilValue } from 'recoil'

const ServiceStatusToggleButtons = ({ value, onChange }) => {
  const windowDimensionsNum = useRecoilValue(windowDimensionsNumSelector)
  return (
    <ButtonGroup size={windowDimensionsNum < 2 ? 'small' : undefined}>
      <Button
        onClick={() =>
          onChange({
            active: !value.active,
            closed:
              !value.active || value.canceled || value.closed
                ? value.closed
                : true,
            canceled: value.canceled,
          })
        }
        variant={value.active ? 'contained' : 'outlined'}
        color="blue"
        className={value.active ? 'text-white' : 'text-blue-400'}
      >
        Активные
      </Button>
      <Button
        onClick={() =>
          onChange({
            active:
              value.active || value.canceled || !value.closed
                ? value.active
                : true,
            closed: !value.closed,
            canceled: value.canceled,
          })
        }
        variant={value.closed ? 'contained' : 'outlined'}
        color="green"
        className={value.closed ? 'text-white' : 'text-green-400'}
      >
        Исполнены
      </Button>
      <Button
        onClick={() =>
          onChange({
            active:
              value.active || !value.canceled || value.closed
                ? value.active
                : true,
            closed: value.closed,
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

export default ServiceStatusToggleButtons
