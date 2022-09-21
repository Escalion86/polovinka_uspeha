import { useRecoilValue } from 'recoil'
import { useState } from 'react'
import directionsAtom from '@state/atoms/directionsAtom'
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  MenuList,
  OutlinedInput,
  Select,
  ToggleButton,
  Button,
  ButtonGroup,
} from '@mui/material'
import { Check } from '@mui/icons-material'

import { getNounDirections } from '@helpers/getNoun'
import { motion } from 'framer-motion'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const Filter = ({ options, show, onChange }) => {
  const onChangeFilter = (key, newValue) => {
    onChange((state) => {
      return { ...state, [key]: newValue }
    })
  }

  const elements = Object.entries(options).map(
    ([key, { type, value, name, items }]) => {
      const [componentValue, setComponentValue] = useState(value)
      const onChangeComponent = (key, newValue) => {
        setComponentValue(newValue)
        onChangeFilter(key, newValue)
      }

      if (type === 'toggle') {
        return (
          <FormControl size="small" className="mt-2" key={key}>
            <ToggleButton
              size="small"
              value="check"
              selected={componentValue}
              onChange={() => onChangeComponent(key, !componentValue)}
              color="primary"
            >
              <Check />
              <div>{name}</div>
            </ToggleButton>
          </FormControl>
        )
      } else if (type === 'directions') {
        const directions = useRecoilValue(directionsAtom)
        return (
          <FormControl
            sx={{ m: 1, width: 300 }}
            size="small"
            margin="none"
            key={key}
          >
            <InputLabel id="demo-multiple-name-label">Направления</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={componentValue}
              onChange={(e) => onChangeComponent(key, e.target.value)}
              input={<OutlinedInput label="Направления" />}
              renderValue={(selected) =>
                selected.length === directions.length
                  ? 'Все'
                  : selected.length === 1
                  ? directions.find(
                      (direction) => direction._id === selected[0]
                    ).title
                  : getNounDirections(selected.length)
              }
              MenuProps={MenuProps}
            >
              {directions.map((direction) => (
                <MenuItem
                  sx={{ padding: 0 }}
                  key={direction._id}
                  value={direction._id}
                >
                  <Checkbox
                    checked={componentValue.indexOf(direction._id) > -1}
                  />
                  <ListItemText primary={direction.title} size="small" />
                  {/* {item.title} */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      } else if (type === 'multiselect') {
        return (
          <FormControl
            sx={{ m: 1, width: 300 }}
            size="small"
            margin="none"
            key={key}
          >
            <InputLabel id="demo-multiple-name-label">{name}</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={componentValue}
              onChange={(e) => onChangeComponent(key, e.target.value)}
              input={<OutlinedInput label={name} />}
              renderValue={(selected) =>
                selected.length === items.length ? 'Все' : selected.join(', ')
              }
              MenuProps={MenuProps}
            >
              {[...items].map((item) => (
                <MenuItem sx={{ padding: 0 }} key={item._id} value={item._id}>
                  <Checkbox checked={componentValue.indexOf(item._id) > -1} />
                  <ListItemText primary={item.title} size="small" />
                  {/* {item.title} */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      }
    }
  )

  return (
    <motion.div
      // initial={{}}
      animate={{ height: show ? 'auto' : 0 }}
      transition={{ type: 'just' }}
      className="flex flex-wrap justify-end overflow-hidden bg-gray-100"
    >
      <div>
        {/* <button
    className={cn(
      'hover:shadow-active duration-300  flex items-center justify-center h-10 px-2 py-1 text-black border border-gray-400 rounded',
      showFinished ? 'bg-green-200' : 'bg-white'
    )}
    onMouseDown={(evt) => {
      evt.preventDefault() // Avoids loosing focus from the editable area
      setShowFinished((state) => !state)
    }}
  >
    <Image src="/img/svg_icons/medal.svg" width="24" height="24" />
    Показывать завершенные
    <FontAwesomeIcon icon={icon} className={iconClassName ?? 'w-5 h-5'} />
  </button> */}
        {elements}
      </div>
    </motion.div>
  )
}

export default Filter
