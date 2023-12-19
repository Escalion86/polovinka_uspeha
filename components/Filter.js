import FilterAltOff from '@mui/icons-material/FilterAltOff'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ChipsSelector from './Chips/ChipsSelector'
import DirectionSelector from './ComboBox/DirectionSelector'

// const ITEM_HEIGHT = 48
// const ITEM_PADDING_TOP = 8
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// }

const Filter = ({
  options,
  show,
  onChange,
  filterOptions,
  defaultFilterValue,
  setShowFilter,
}) => {
  const [rerender, setRerender] = useState(false)
  const onChangeFilter = (key, newValue) => {
    onChange((state) => {
      return { ...state, [key]: newValue }
    })
  }

  const elements = Object.entries(options)
    // .filter(([key, { type, value, name, items }]) => type !== 'directions')
    .map(([key, { type, value, name, items }], index) => {
      const [componentValue, setComponentValue] = useState(value)
      const onChangeComponent = (key, newValue) => {
        setComponentValue(newValue)
        onChangeFilter(key, newValue)
      }

      useEffect(() => {
        if (componentValue !== value) setComponentValue(value)
      }, [rerender])

      // if (type === 'toggle') {
      //   return (
      //     <FormControl size="small" className="mt-2" key={key}>
      //       <ToggleButton
      //         size="small"
      //         value="check"
      //         selected={componentValue}
      //         onChange={() => onChangeComponent(key, !componentValue)}
      //         color="primary"
      //       >
      //         <Check />
      //         <div>{name}</div>
      //       </ToggleButton>
      //     </FormControl>
      //   )
      // } else
      if (type === 'tags') {
        return (
          // <FormControl
          //   size="small"
          //   className="max-w-full min-w-full px-1"
          //   key={key}
          // >
          <ChipsSelector
            key={key}
            label="Тэги"
            items={items}
            onChange={(tags) => onChangeComponent(key, tags)}
            value={filterOptions.tags}
            canEditChips={false}
            // noWrapper={false}
            placeholder="Показывать все тэги"
            // noMargin
            smallMargin
            // className="mt-2 mb-1"
            fullWidth
            // className={className}
          />
          // </FormControl>
        )
      } else if (type === 'directions') {
        return (
          <DirectionSelector
            value={componentValue}
            onChange={(value) => onChangeComponent(key, value)}
            placeholder="ВСЕ НАПРАВЛЕНИЯ"
            activePlaceholder
            fullWidth
          />
        )

        // } else if (type === 'directions') {
        //   const directions = useRecoilValue(directionsAtom)
        //   return (
        //     <FormControl sx={{ width: 300 }} size="small" margin="none" key={key}>
        //       <InputLabel id="demo-multiple-name-label">Направления</InputLabel>
        //       <Select
        //         labelId="demo-multiple-name-label"
        //         id="demo-multiple-name"
        //         multiple
        //         value={componentValue}
        //         onChange={(e) => onChangeComponent(key, e.target.value)}
        //         input={<OutlinedInput label="Направления" />}
        //         renderValue={(selected) =>
        //           selected.length === directions.length
        //             ? 'Все'
        //             : selected.length === 1
        //             ? directions.find(
        //                 (direction) => direction._id === selected[0]
        //               ).title
        //             : getNounDirections(selected.length)
        //         }
        //         MenuProps={MenuProps}
        //       >
        //         {directions.map((direction) => (
        //           <MenuItem
        //             sx={{ padding: 0 }}
        //             key={direction._id}
        //             value={direction._id}
        //           >
        //             <Checkbox
        //               checked={componentValue.indexOf(direction._id) > -1}
        //             />
        //             <ListItemText primary={direction.title} size="small" />
        //             {/* {item.title} */}
        //           </MenuItem>
        //         ))}
        //       </Select>
        //     </FormControl>
        //   )
        // } else if (type === 'multiselect') {
        //   return (
        //     <FormControl sx={{ width: 300 }} size="small" margin="none" key={key}>
        //       <InputLabel id="demo-multiple-name-label">{name}</InputLabel>
        //       <Select
        //         labelId="demo-multiple-name-label"
        //         id="demo-multiple-name"
        //         multiple
        //         value={componentValue}
        //         onChange={(e) => onChangeComponent(key, e.target.value)}
        //         input={<OutlinedInput label={name} />}
        //         renderValue={(selected) =>
        //           selected.length === items.length ? 'Все' : selected.join(', ')
        //         }
        //         MenuProps={MenuProps}
        //       >
        //         {[...items].map((item) => (
        //           <MenuItem sx={{ padding: 0 }} key={item._id} value={item._id}>
        //             <Checkbox checked={componentValue.indexOf(item._id) > -1} />
        //             <ListItemText primary={item.title} size="small" />
        //             {/* {item.title} */}
        //           </MenuItem>
        //         ))}
        //       </Select>
        //     </FormControl>
        //   )
      } else return null
    })

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: show ? 'auto' : 0 }}
      transition={{ type: 'just' }}
      className="w-full overflow-hidden"
    >
      <div className="flex flex-col w-full px-1 pb-1 overflow-hidden">
        {/* <div> */}
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
        {elements.map((el, index) => {
          if (defaultFilterValue && index === elements.length - 1)
            return (
              <div key={index} className="flex items-center">
                {el}
                <div
                  className="flex p-1 mt-3 ml-1 mr-1 cursor-pointer group"
                  onClick={() => {
                    onChange(defaultFilterValue)
                    setShowFilter && setShowFilter(false)
                    setRerender((state) => !state)
                  }}
                >
                  <FilterAltOff className="transition-all duration-300 text-danger group-hover:scale-125" />
                </div>
              </div>
            )
          return el
        })}
        {/* <FontAwesomeIcon
            className="z-10 w-6 h-6 text-white duration-200 max-w-6 max-h-6 group-hover:scale-125"
            icon={faFilterRe}
          /> */}

        {/* </div> */}
      </div>
    </motion.div>
  )
}

export default Filter
