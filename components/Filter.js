import FilterAltOff from '@mui/icons-material/FilterAltOff'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import DirectionSelector from './ComboBox/DirectionSelector'
import ServiceSelector from './ComboBox/ServiceSelector'
import EventTagsChipsSelector from './Chips/EventTagsChipsSelector'

const Filter = ({
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

  const elements = Object.entries(filterOptions).map(([key, value], index) => {
    const [componentValue, setComponentValue] = useState(value || '')
    const onChangeComponent = (key, newValue) => {
      setComponentValue(newValue)
      onChangeFilter(key, newValue)
    }

    useEffect(() => {
      if (componentValue !== value) setComponentValue(value)
    }, [rerender])

    if (key === 'tags') {
      return (
        <EventTagsChipsSelector
          key="tagsFilter"
          onChange={(tags) => onChangeComponent(key, tags)}
          tags={filterOptions.tags}
          canEditChips={false}
          placeholder="Показывать все тэги"
          smallMargin
          fullWidth
        />
      )
    } else if (key === 'directions') {
      return (
        <DirectionSelector
          key="directionsFilter"
          value={componentValue}
          onChange={(value) => onChangeComponent(key, value)}
          placeholder="ВСЕ НАПРАВЛЕНИЯ"
          activePlaceholder
          fullWidth
        />
      )
    } else if (key === 'services') {
      return (
        <ServiceSelector
          key="servicesFilter"
          value={componentValue}
          onChange={(value) => onChangeComponent(key, value)}
          placeholder="ВСЕ УСЛУГИ"
          activePlaceholder
          fullWidth
        />
      )
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
