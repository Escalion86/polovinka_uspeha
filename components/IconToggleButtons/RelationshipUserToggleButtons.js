import { useAtomValue } from 'jotai'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import Image from 'next/image'
import cn from 'classnames'

const RelationshipUserToggleButtons = ({ value, onChange, names }) => {
  const windowDimensionsNum = useAtomValue(windowDimensionsNumSelector)
  return (
    <ButtonGroup size={windowDimensionsNum < 2 ? 'small' : undefined}>
      <Button
        onClick={() =>
          onChange({
            havePartner:
              !value.havePartner && value.noPartner ? true : value.havePartner,
            noPartner: !value.noPartner,
          })
        }
        variant={value.noPartner ? 'contained' : 'outlined'}
        color="blue"
        aria-label="noPartner"
        className={cn(
          'flex gap-x-2',
          value.noPartner ? 'text-white' : 'text-blue-400'
        )}
      >
        <div className="w-6 h-6">
          <Image
            src="/img/relationships/noPartner.png"
            width="24"
            height="24"
            alt="noPartner"
          />
        </div>
        {names?.havePartner}
      </Button>
      <Button
        onClick={() =>
          onChange({
            havePartner: !value.havePartner,
            noPartner:
              value.havePartner && !value.noPartner ? true : value.noPartner,
          })
        }
        variant={value.havePartner ? 'contained' : 'outlined'}
        color="green"
        aria-label="havePartner"
        className={cn(
          'flex gap-x-2',
          value.havePartner ? 'text-white' : 'text-green-400'
        )}
      >
        <div className="w-6 h-6">
          <Image
            src="/img/relationships/havePartner.png"
            width="24"
            height="24"
            alt="havePartner"
          />
        </div>
        {names?.noPartner}
      </Button>
    </ButtonGroup>
  )
}

export default RelationshipUserToggleButtons
