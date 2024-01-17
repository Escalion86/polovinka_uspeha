import FilterAltOff from '@mui/icons-material/FilterAltOff'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ChipsSelector from './Chips/ChipsSelector'
import DirectionSelector from './ComboBox/DirectionSelector'

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

  const elements = Object.entries(options).map(
    ([key, { type, value, name, items }], index) => {
      const [componentValue, setComponentValue] = useState(value)
      const onChangeComponent = (key, newValue) => {
        setComponentValue(newValue)
        onChangeFilter(key, newValue)
      }

      useEffect(() => {
        if (componentValue !== value) setComponentValue(value)
      }, [rerender])
      if (type === 'tags') {
        return (
          <ChipsSelector
            key={key}
            label="Тэги"
            items={items}
            onChange={(tags) => onChangeComponent(key, tags)}
            value={filterOptions.tags}
            canEditChips={false}
            placeholder="Показывать все тэги"
            smallMargin
            fullWidth
          />
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
      } else return null
    }
  )

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: show ? 'auto' : 0 }}
      transition={{ type: 'just' }}
      className="w-full overflow-hidden"
    >
      <div className="flex flex-col w-full px-1 pb-1 overflow-hidden">
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
      </div>
    </motion.div>
  )
}

export default Filter
