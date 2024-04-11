import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import Image from 'next/image'
import { useRecoilValue } from 'recoil'

const RelationshipUserToggleButtons = ({ value, onChange }) => {
  const windowDimensionsNum = useRecoilValue(windowDimensionsNumSelector)
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
      >
        <div className="w-6 h-6">
          <Image
            src="/img/relationships/noPartner.png"
            width="24"
            height="24"
            alt="noPartner"
          />
        </div>
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
      >
        <div className="w-6 h-6">
          <Image
            src="/img/relationships/havePartner.png"
            width="24"
            height="24"
            alt="havePartner"
          />
        </div>
      </Button>
    </ButtonGroup>
  )
}

export default RelationshipUserToggleButtons
