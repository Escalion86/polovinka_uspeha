import Image from 'next/image'
import Tooltip from './Tooltip'
import { Suspense } from 'react'
import subEventsSumOfEventSelector from '@state/selectors/subEventsSumOfEventSelector'
import { useAtomValue } from 'jotai'
import PropTypes from 'prop-types'
import {
  hasPartnerRelationship,
  isMarriedRelationship,
} from '@helpers/relationshipStatus'

const WeddingRingsIcon = ({ size }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 32 26"
    fill="none"
  >
    <circle cx="12" cy="15" r="8" stroke="#d49a16" strokeWidth="3" />
    <circle cx="20" cy="11" r="8" stroke="#f4c542" strokeWidth="3" />
    <path d="M17 4.5 20 1l3 3.5-3 2.8-3-2.8Z" fill="#bde8ff" />
  </svg>
)

WeddingRingsIcon.propTypes = {
  size: PropTypes.number.isRequired,
}

const UserRelationshipIconByEventIdComponent = ({ eventId, ...props }) => {
  const subEventSum = useAtomValue(subEventsSumOfEventSelector(eventId))
  return (
    subEventSum.usersRelationshipAccess &&
    subEventSum.usersRelationshipAccess !== 'yes' && (
      <UserRelationshipIconByEventId
        {...props}
        relationship={subEventSum.usersRelationshipAccess === 'only'}
      />
    )
  )
}

export const UserRelationshipIconByEventId = (props) => (
  <Suspense>
    <UserRelationshipIconByEventIdComponent {...props} />
  </Suspense>
)

const UserRelationshipIcon = ({
  relationship,
  size,
  showName = false,
  showHavePartnerOnly,
  nameForEvent = false,
}) => {
  const havePartner = hasPartnerRelationship(relationship)
  const isMarried = isMarriedRelationship(relationship)
  if (showHavePartnerOnly && !havePartner) return null

  var numSize
  switch (size) {
    case 'xs':
      numSize = 3
      break
    case 's':
      numSize = 4
      break
    case 'm':
      numSize = 5
      break
    case 'l':
      numSize = 6
      break
    default:
      numSize = 6
  }

  const name = nameForEvent
    ? havePartner
      ? 'Только для пар'
      : 'Только для тех у кого нет второй половинки'
    : isMarried
      ? 'В браке'
      : havePartner
        ? 'Есть пара'
        : 'Нет пары'

  const Icon = () => (
    <Tooltip title={name}>
      <div
        className={`flex items-center justify-center min-w-${numSize + 1} w-${
          numSize + 1
        } h-${numSize + 1}`}
      >
        {isMarried ? (
          <WeddingRingsIcon size={numSize * 5} />
        ) : (
          <Image
            alt={havePartner ? 'Есть пара' : 'Нет пары'}
            src={
              '/img/relationships/' +
              (havePartner ? 'havePartner' : 'noPartner') +
              '.png'
            }
            width={numSize * 5}
            height={numSize * 5}
          />
        )}
      </div>
    </Tooltip>
  )

  if (showName)
    return (
      <div className="flex items-center gap-x-2">
        <Icon />
        <span>{name}</span>
      </div>
    )

  return <Icon />
}

UserRelationshipIcon.propTypes = {
  relationship: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  size: PropTypes.oneOf(['xs', 's', 'm', 'l']),
  showName: PropTypes.bool,
  showHavePartnerOnly: PropTypes.bool,
  nameForEvent: PropTypes.bool,
}

export default UserRelationshipIcon
