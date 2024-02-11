import { faBan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import Image from 'next/legacy/image'
import { useRecoilValue } from 'recoil'

const StatusUserToggleButtons = ({ value, onChange }) => {
  const windowDimensionsNum = useRecoilValue(windowDimensionsNumSelector)
  return (
    <ButtonGroup size={windowDimensionsNum < 2 ? 'small' : undefined}>
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
      >
        <div className="w-6 h-6">
          <Image src="/img/svg_icons/medal.svg" width="24" height="24" />
        </div>
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
        color="gray"
      >
        <div className="w-6 h-6 grayscale brightness-150 contrast-75 ">
          <Image src="/img/svg_icons/medal.svg" width="24" height="24" />
        </div>
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
        <FontAwesomeIcon className="w-6 h-6" icon={faBan} />
      </Button>
    </ButtonGroup>
  )
}

export default StatusUserToggleButtons
