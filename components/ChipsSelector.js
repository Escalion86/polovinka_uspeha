import cn from 'classnames'
import { forwardRef, useState } from 'react'
import InputWrapper from './InputWrapper'

// import { useTheme } from '@mui/material/styles'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

const ITEM_HEIGHT = 40
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

// function getStyles(name, personName, theme) {
//   return {
//     fontWeight:
//       personName.indexOf(name) === -1
//         ? theme.typography.fontWeightRegular
//         : theme.typography.fontWeightMedium,
//   }
// }

const ChipsSelector = forwardRef(
  (
    {
      label,
      onChange,
      value,
      items,
      inputClassName,
      labelClassName,
      error = false,
      copyPasteButtons = false,
      wrapperClassName,
      noBorder = false,
      placeholder,
      disabled = false,
      min,
      max,
      required,
      step,
      labelPos,
      onFocus,
      defaultValue,
    },
    ref
  ) => {
    // const [personName, setPersonName] = useState([])
    // const theme = useTheme()

    // const handleChange = (event) => {
    //   const {
    //     target: { value },
    //   } = event
    //   setPersonName(
    //     // On autofill we get a stringified value.
    //     typeof value === 'string' ? value.split(',') : value
    //   )
    // }

    return (
      // <InputWrapper
      //   label={label}
      //   labelClassName={labelClassName}
      //   onChange={onChange}
      //   copyPasteButtons={copyPasteButtons}
      //   value={value}
      //   className={wrapperClassName}
      //   required={required}
      //   labelPos={labelPos}
      // >
      //   <div
      //     className={cn(
      //       'flex rounded overflow-hidden bg-white',
      //       error ? 'border-red-500' : 'border-gray-400',
      //       inputClassName ? inputClassName : 'w-full',
      //       noBorder ? '' : 'border'
      //     )}
      //   >
      <FormControl fullWidth size="small">
        <InputLabel>{label}</InputLabel>
        <Select
          // labelId="demo-multiple-chip-label"
          // id="demo-multiple-chip"
          // sx={{ paddingY: 0 }}
          // className="w-full"
          multiple
          value={value}
          onChange={(e) => onChange(e.target.value)}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => (
            <div className="flex flex-wrap gap-0.5">
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  onMouseDown={(event) => {
                    event.stopPropagation()
                  }}
                  // onClick={(e) => e.stopPropagation()}
                  onDelete={(e) => {
                    // e.stopPropagation()
                    onChange((state) => state.filter((item) => item !== value))
                  }}
                />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {items.map((item) => {
            const isSelected = value.includes(item)
            return (
              <MenuItem
                // sx={{ padding: 0 }}
                key={item}
                value={item}
                className={cn(
                  'hover:bg-general hover:text-white bg-white group'
                  // isSelected ? 'bg-success text-white' : 'bg-white'
                )}
              >
                <div className="w-5 h-5 mr-2 text-success group-hover:text-white">
                  {isSelected && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      // className="w-5 h-5 mr-1 text-white"
                    />
                  )}
                </div>
                <div>{item}</div>
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
      //   </div>
      // </InputWrapper>
    )
  }
)

export default ChipsSelector
