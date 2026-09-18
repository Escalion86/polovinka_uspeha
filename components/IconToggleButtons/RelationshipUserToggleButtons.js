import { useAtomValue } from 'jotai'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import Image from 'next/image'
import cn from 'classnames'
import PropTypes from 'prop-types'
import UserRelationshipIcon from '@components/UserRelationshipIcon'
import { RELATIONSHIP_STATUS_MARRIED } from '@helpers/relationshipStatus'

const RelationshipUserToggleButtons = ({
  value,
  onChange,
  names,
  hideMarried = false,
}) => {
  const windowDimensionsNum = useAtomValue(windowDimensionsNumSelector)

  const toggleValue = (key) => {
    const nextValue = {
      noPartner: Boolean(value.noPartner),
      havePartner: Boolean(value.havePartner),
      ...(!hideMarried ? { married: Boolean(value.married) } : {}),
    }

    if (
      nextValue[key] &&
      Object.values(nextValue).filter(Boolean).length === 1
    ) {
      return
    }

    nextValue[key] = !nextValue[key]
    onChange(nextValue)
  }

  return (
    <ButtonGroup
      size={windowDimensionsNum < 2 ? 'small' : undefined}
      className="text-white"
    >
      <Button
        onClick={() => toggleValue('noPartner')}
        variant={value.noPartner ? 'contained' : 'outlined'}
        color="blue"
        aria-label="noPartner"
        className={cn('flex gap-x-2', value.noPartner ? '' : 'text-blue-400')}
      >
        <div className="w-6 h-6 min-h-6">
          <Image
            src="/img/relationships/noPartner.png"
            width="24"
            height="24"
            alt="noPartner"
          />
        </div>
        {names?.noPartner}
      </Button>
      <Button
        onClick={() => toggleValue('havePartner')}
        variant={value.havePartner ? 'contained' : 'outlined'}
        color="general"
        aria-label="havePartner"
        className={cn('flex gap-x-2', value.havePartner ? '' : 'text-general')}
      >
        <div className="w-6 h-6 min-h-6">
          <Image
            src="/img/relationships/havePartner.png"
            width="24"
            height="24"
            alt="havePartner"
          />
        </div>
        {names?.havePartner}
      </Button>
      {!hideMarried && (
        <Button
          onClick={() => toggleValue('married')}
          variant={value.married ? 'contained' : 'outlined'}
          color="warning"
          aria-label="married"
          className={cn(
            'flex gap-x-2',
            value.married ? '' : 'text-yellow-600'
          )}
        >
          <div className="flex items-center justify-center w-6 h-6 min-h-6">
            <UserRelationshipIcon
              relationship={RELATIONSHIP_STATUS_MARRIED}
              size="s"
            />
          </div>
          {names?.married}
        </Button>
      )}
    </ButtonGroup>
  )
}

RelationshipUserToggleButtons.propTypes = {
  value: PropTypes.shape({
    noPartner: PropTypes.bool,
    havePartner: PropTypes.bool,
    married: PropTypes.bool,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  names: PropTypes.shape({
    noPartner: PropTypes.node,
    havePartner: PropTypes.node,
    married: PropTypes.node,
  }),
  hideMarried: PropTypes.bool,
}

export default RelationshipUserToggleButtons
