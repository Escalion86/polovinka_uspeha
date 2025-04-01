import { useAtomValue } from 'jotai'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import cn from 'classnames'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons/faCheckDouble'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock'

const MessageStatusToggleButtons = ({ value, onChange, names }) => {
  const windowDimensionsNum = useAtomValue(windowDimensionsNumSelector)
  return (
    <ButtonGroup size={windowDimensionsNum < 2 ? 'small' : undefined}>
      <Button
        onClick={() => {
          // if (hideBanned)
          //   return onChange({
          //     novice: !value.novice && value.member && value.novice,
          //     member: !value.member,
          //   })
          return onChange({
            read: !value.read,
            delivered:
              value.read &&
              !value.delivered &&
              !value.sent &&
              !value.other &&
              !value.pending
                ? true
                : value.delivered,
            sent: value.sent,
            other: value.other,
            pending: value.pending,
          })
        }}
        variant={value.read ? 'contained' : 'outlined'}
        color="green"
        aria-label="read"
        className={cn(
          'flex gap-x-2',
          value.read ? 'text-white' : 'text-success'
        )}
      >
        <FontAwesomeIcon className="w-6 h-6" icon={faCheckDouble} />
        {names?.read}
      </Button>
      <Button
        onClick={() => {
          // if (hideBanned)
          //   return onChange({
          //     novice: !value.novice && value.member && value.novice,
          //     member: !value.member,
          //   })
          return onChange({
            read:
              !value.read &&
              value.delivered &&
              !value.sent &&
              !value.other &&
              !value.pending
                ? true
                : value.read,
            delivered: !value.delivered,
            sent: value.sent,
            other: value.other,
            pending: value.pending,
          })
        }}
        variant={value.delivered ? 'contained' : 'outlined'}
        color="gray"
        aria-label="delivered"
        className={cn(
          'flex gap-x-2',
          value.delivered ? 'text-white' : 'text-gray-600'
        )}
      >
        <FontAwesomeIcon className="w-6 h-6" icon={faCheckDouble} />
        {names?.delivered}
      </Button>
      <Button
        onClick={() => {
          // if (hideBanned)
          //   return onChange({
          //     novice: !value.novice && value.member && value.novice,
          //     member: !value.member,
          //   })
          return onChange({
            read:
              !value.read &&
              !value.delivered &&
              value.sent &&
              !value.other &&
              !value.pending
                ? true
                : value.read,
            delivered: value.delivered,
            sent: !value.sent,
            other: value.other,
            pending: value.pending,
          })
        }}
        variant={value.sent ? 'contained' : 'outlined'}
        color="gray"
        aria-label="sent"
        className={cn(
          'flex gap-x-2',
          value.sent ? 'text-white' : 'text-gray-600'
        )}
      >
        <FontAwesomeIcon className="w-6 h-6" icon={faCheck} />
        {names?.sent}
      </Button>
      <Button
        onClick={() => {
          // if (hideBanned)
          //   return onChange({
          //     novice: !value.novice && value.member && value.novice,
          //     member: !value.member,
          //   })
          return onChange({
            read:
              !value.read &&
              !value.delivered &&
              !value.sent &&
              value.other &&
              !value.pending
                ? true
                : value.read,
            delivered: value.delivered,
            sent: value.sent,
            other: !value.other,
            pending: value.pending,
          })
        }}
        variant={value.other ? 'contained' : 'outlined'}
        color="red"
        aria-label="other"
        className={cn(
          'flex gap-x-2',
          value.other ? 'text-white' : 'text-danger'
        )}
      >
        <FontAwesomeIcon className="w-6 h-6" icon={faTimes} />
        {names?.other}
      </Button>
      <Button
        onClick={() => {
          // if (hideBanned)
          //   return onChange({
          //     novice: !value.novice && value.member && value.novice,
          //     member: !value.member,
          //   })
          return onChange({
            read:
              !value.read &&
              !value.delivered &&
              !value.sent &&
              !value.other &&
              value.pending
                ? true
                : value.read,
            delivered: value.delivered,
            sent: value.sent,
            other: value.other,
            pending: !value.pending,
          })
        }}
        variant={value.pending ? 'contained' : 'outlined'}
        color="gray"
        aria-label="pending"
        className={cn(
          'flex gap-x-2',
          value.pending ? 'text-white' : 'text-gray-600'
        )}
      >
        <FontAwesomeIcon className="w-6 h-6" icon={faClock} />
        {names?.pending}
      </Button>
    </ButtonGroup>
  )
}

export default MessageStatusToggleButtons
