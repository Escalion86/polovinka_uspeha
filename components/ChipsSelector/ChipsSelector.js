import cn from 'classnames'
import { forwardRef, useState } from 'react'

// import OutlinedInput from '@mui/material/OutlinedInput'
// import InputLabel from '@mui/material/InputLabel'
// import MenuItem from '@mui/material/MenuItem'
// import FormControl from '@mui/material/FormControl'
// import Select from '@mui/material/Select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  // faCheck,
  faTimes,
  faWrench,
} from '@fortawesome/free-solid-svg-icons'
// import { textColorClassCalc } from '@helpers/calcLuminance'
import InputWrapper from '@components/InputWrapper'
import DropDown from '@components/DropDown'
import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'

// const ITEM_HEIGHT = 40
// const ITEM_PADDING_TOP = 8
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// }

// function getStyles(name, personName, theme) {
//   return {
//     fontWeight:
//       personName.indexOf(name) === -1
//         ? theme.typography.fontWeightRegular
//         : theme.typography.fontWeightMedium,
//   }
// }

// const items = [
//   { text: 'поход', color: '#4488AA' },
//   { text: 'природа', color: '#009000' },
//   { text: 'настолки', color: '#000090' },
// ]

const Chip = ({ text, color, onClose }) => (
  <div
    className="flex items-center py-0.5 pl-2 pr-1 rounded-full cursor-default"
    style={{ backgroundColor: color }}
    onClick={(e) => e.stopPropagation()}
  >
    <div
      className={cn(
        'text-sm mt-[1px] uppercase select-none pr-1',
        // textColorClassCalc(color)
        'text-gray-700'
      )}
    >
      {text}
    </div>
    {onClose && (
      <div
        onClick={onClose}
        className="flex items-center justify-center p-0.5 bg-white rounded-full cursor-pointer group"
      >
        <FontAwesomeIcon
          icon={faTimes}
          style={{ color: color }}
          className={cn('w-4 h-4 duration-300 group-hover:scale-125')}
        />
      </div>
    )}
  </div>
)

const ChipsSelector = forwardRef(
  (
    {
      label,
      onChange,
      value,
      items,
      className,
      inputClassName,
      labelClassName,
      error = false,
      wrapperClassName,
      noBorder = false,
      placeholder,
      disabled = false,
      required,
      defaultValue,
      fullWidth = false,
      noMargin = false,
      showDisabledIcon = true,
      prefix,
      prefixClassName,
      postfix,
      postfixClassName,
      showErrorText = false,
      floatingLabel = true,
      editor = true,
    },
    ref
  ) => {
    const modalsFunc = useRecoilValue(modalsFuncAtom)
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
      <DropDown
        strategyAbsolute
        // placement="top"
        menuClassName="mt-6"
        trigger={
          <InputWrapper
            label={label}
            labelClassName={labelClassName}
            value={value ?? defaultValue}
            className={cn('cursor-pointer', className)}
            required={required}
            floatingLabel={floatingLabel}
            error={error}
            showErrorText={showErrorText}
            paddingY
            paddingX
            postfix={postfix}
            prefix={prefix}
            ref={ref}
            disabled={disabled}
            fullWidth={fullWidth}
            noBorder={noBorder}
            noMargin={noMargin}
            showDisabledIcon={showDisabledIcon}
            wrapperClassName="gap-x-1 flex-wrap gap-y-1"
          >
            {value.map((text) => (
              <Chip
                text={text}
                color={items.find((item) => item.text === text)?.color}
                onClose={() => onChange(value.filter((val) => val !== text))}
              />
            ))}
            {editor && (
              <div className="flex items-center justify-end flex-1">
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    modalsFunc.eventsTags.edit()
                  }}
                  className="flex items-center justify-center p-0.5 cursor-pointer group"
                >
                  <FontAwesomeIcon
                    icon={faWrench}
                    className="w-4 h-4 text-gray-400 duration-300 group-hover:text-gray-700 group-hover:scale-125"
                  />
                </div>
              </div>
            )}
          </InputWrapper>
        }
        className="w-full"
        menuPadding={false}
        turnOffAutoClose="inside"
        // openOnHover
      >
        <div className="flex flex-col overflow-hidden rounded-lg">
          {items.map((item) => {
            const isActive = value.includes(item.text)
            return (
              <div
                className={cn(
                  'px-2 py-1 overflow-hidden uppercase cursor-pointer select-none',
                  // isActive ? textColorClassCalc(item.color) : ''
                  // isActive ? 'text-gray-700' : ''
                  'text-gray-700'
                )}
                style={{
                  backgroundColor: isActive ? item.color : 'white',
                  // color: isActive ? undefined : item.color,
                }}
                onClick={() =>
                  isActive
                    ? onChange(value.filter((text) => text !== item.text))
                    : onChange([...value, item.text])
                }
              >
                {item.text}
              </div>
            )
          })}
        </div>
      </DropDown>
    )

    // return (
    //   // <InputWrapper
    //   //   label={label}
    //   //   labelClassName={labelClassName}
    //   //   onChange={onChange}
    //   //   copyPasteButtons={copyPasteButtons}
    //   //   value={value}
    //   //   className={wrapperClassName}
    //   //   required={required}
    //   //   labelPos={labelPos}
    //   // >
    //   //   <div
    //   //     className={cn(
    //   //       'flex rounded overflow-hidden bg-white',
    //   //       error ? 'border-red-500' : 'border-gray-400',
    //   //       inputClassName ? inputClassName : 'w-full',
    //   //       noBorder ? '' : 'border'
    //   //     )}
    //   //   >
    //   <FormControl fullWidth size="small">
    //     <InputLabel>{label}</InputLabel>
    //     <Select
    //       // labelId="demo-multiple-chip-label"
    //       // id="demo-multiple-chip"
    //       // sx={{ paddingY: 0 }}
    //       // className="w-full"
    //       multiple
    //       value={value}
    //       onChange={(e) => onChange(e.target.value)}
    //       input={<OutlinedInput label={label} />}
    //       renderValue={(selected) => (
    //         <div className="flex flex-wrap gap-0.5">
    //           {selected.map((value) => (
    //             <Chip
    //               key={value}
    //               label={value}
    //               onMouseDown={(event) => {
    //                 event.stopPropagation()
    //               }}
    //               // onClick={(e) => e.stopPropagation()}
    //               onDelete={(e) => {
    //                 // e.stopPropagation()
    //                 onChange((state) => state.filter((item) => item !== value))
    //               }}
    //             />
    //           ))}
    //         </div>
    //       )}
    //       MenuProps={MenuProps}
    //     >
    //       {items.map((item) => {
    //         const isSelected = value.includes(item)
    //         return (
    //           <MenuItem
    //             // sx={{ padding: 0 }}
    //             key={item}
    //             value={item}
    //             className={cn(
    //               'hover:bg-general hover:text-white bg-white group'
    //               // isSelected ? 'bg-success text-white' : 'bg-white'
    //             )}
    //           >
    //             <div className="w-5 h-5 mr-2 text-success group-hover:text-white">
    //               {isSelected && (
    //                 <FontAwesomeIcon
    //                   icon={faCheck}
    //                   // className="w-5 h-5 mr-1 text-white"
    //                 />
    //               )}
    //             </div>
    //             <div>{item}</div>
    //           </MenuItem>
    //         )
    //       })}
    //     </Select>
    //   </FormControl>
    //   //   </div>
    //   // </InputWrapper>
    // )
  }
)

export default ChipsSelector
