import { useAtomValue } from 'jotai'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import cn from 'classnames'

const ToggleButtons = ({
  value,
  onChange,
  buttonsConfig,
  canSelectNone,
  iconsOnly,
  names,
}) => {
  const windowDimensionsNum = useAtomValue(windowDimensionsNumSelector)

  const onClick = (item) => {
    const result = { ...value, [item.value]: !value[item.value] }
    if (!canSelectNone) {
      var noSelected = true
      for (const key in result) {
        if (result[key]) {
          noSelected = false
          break
        }
      }

      if (noSelected) {
        if (Object.keys(result)[0] === item.value)
          result[Object.keys(result)[1]] = true
        else result[Object.keys(result)[0]] = true
      }
    }

    onChange(result)
  }

  return (
    <ButtonGroup size={windowDimensionsNum < 2 ? 'small' : undefined}>
      {buttonsConfig.map((cfg) => {
        return (
          <Button
            key={cfg.value}
            onClick={() => onClick(cfg)}
            variant={value[cfg.value] ? 'contained' : 'outlined'}
            color={
              cfg.color.indexOf('-') > 0
                ? cfg.color.slice(0, cfg.color.indexOf('-'))
                : cfg.color
            }
            className={cn(
              'flex items-center gap-x-1',
              value[cfg.value] ? 'text-white' : `text-${cfg.color}`
            )}
            aria-label={cfg.value}
          >
            {cfg.icon && (
              <FontAwesomeIcon className="w-6 h-6" icon={cfg.icon} />
            )}
            {!iconsOnly && cfg.name}
            {names ? names[cfg.value] : null}
          </Button>
        )
      })}
    </ButtonGroup>
  )
}

export default ToggleButtons
