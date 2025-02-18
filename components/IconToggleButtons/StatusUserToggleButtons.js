import { useAtomValue } from 'jotai'

import { faBan } from '@fortawesome/free-solid-svg-icons/faBan'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import Image from 'next/image'
import cn from 'classnames'

const StatusUserToggleButtons = ({ value, onChange, names }) => {
  const windowDimensionsNum = useAtomValue(windowDimensionsNumSelector)
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
        aria-label="novice"
        className={cn(
          'flex gap-x-2',
          value.member ? 'text-white' : 'text-blue-400'
        )}
      >
        <div className="w-6 h-6">
          <Image
            alt="member"
            src="/img/svg_icons/medal.svg"
            width="24"
            height="24"
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>
        {names?.member}
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
        aria-label="member"
        className={cn(
          'flex gap-x-2',
          value.novice ? 'text-white' : 'text-gray-400'
        )}
      >
        <div className="w-6 h-6 grayscale brightness-150 contrast-75 ">
          <Image
            alt="member"
            src="/img/svg_icons/medal.svg"
            width="24"
            height="24"
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>
        {names?.novice}
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
        className={cn(
          'flex gap-x-2',
          value.ban ? 'text-white' : 'text-red-400'
        )}
        aria-label="ban"
      >
        <FontAwesomeIcon className="w-6 h-6" icon={faBan} />
        {names?.ban}
      </Button>
    </ButtonGroup>
  )
}

export default StatusUserToggleButtons
