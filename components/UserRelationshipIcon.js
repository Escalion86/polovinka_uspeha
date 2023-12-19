import Image from 'next/image'
import Tooltip from './Tooltip'
import { RELATIONSHIP_VALUES } from '@helpers/constants'

const UserRelationshipIcon = ({ relationship, size, showName = false }) => {
  if (!relationship) return null
  const relation = RELATIONSHIP_VALUES.find(
    ({ value }) => value === relationship
  )
  if (!relation) return null

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

  const Icon = () => (
    <Tooltip title={relation.name}>
      <div
        className={`flex items-center justify-center min-w-${numSize + 1} w-${
          numSize + 1
        } h-${numSize + 1}`}
      >
        <Image
          src={'/img/relationships/' + relation.value + '.png'}
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
        <span>{relation.name}</span>
      </div>
    )

  return <Icon />
}

export default UserRelationshipIcon
