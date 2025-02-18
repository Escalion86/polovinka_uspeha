import Image from 'next/image'
import Tooltip from './Tooltip'
import { Suspense } from 'react'
import subEventsSumOfEventSelector from '@state/selectors/subEventsSumOfEventSelector'
import { useAtomValue } from 'jotai'

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
  const havePartner = relationship === true || relationship === 'havePartner'
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
        <Image
          alt={havePartner ? 'havePartnerIcon' : 'noPartnerIcon'}
          src={
            '/img/relationships/' +
            (havePartner ? 'havePartner' : 'noPartner') +
            '.png'
          }
          width={numSize * 5}
          height={numSize * 5}
        />
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

export default UserRelationshipIcon
